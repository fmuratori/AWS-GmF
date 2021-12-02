import { Request, Response } from 'express';
import mongoose from 'mongoose';
import FoodModel, { FoodDocument } from '../models/foodModel';
import PackModel, { PackDocument } from '../models/packModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<PackDocument>()

export default class PackController {

	edit = factory.edit(PackModel)

	find = catchAsync(async (req: Request, res: Response) => {
		const packs = await PackModel.aggregate([
			{
				$unwind: "$foodList"
			},
			{
				$addFields: {"foodId": {"$toObjectId": "$foodList.foodId"}}
			},
			{
				$lookup: {
					"from": "foods",
					"localField": "foodId",
					"foreignField": "_id",
					"as": "food"
					}
				},
				{
				$unwind: "$food"
			},
			{
				$group: {
					_id: "$_id",
					"foodList": {"$push": "$food"},
				}
			},
			
			{
				$lookup: {
					"from": "packs",
					"localField": "_id",
					"foreignField": "_id",
					"as": "pack"
				}
			},
			{
				$unwind: "$pack"
			},
			
			{
				$lookup: {
					"from": "families",
					"localField": "pack.familyId",
					"foreignField": "_id",
					"as": "family"
				}
			},
			{
				$unwind: "$family"
			},
			{
				$project: {
					"pack.familyId": 0
				}
			}
		])
		res.status(200).json(packs);
	})

	findExpanded = catchAsync(async (req: Request, res: Response) => {
		const pack = await PackModel.aggregate([
			{
				$unwind: "$foodList"
			},
			{
				$addFields: {"foodId": {"$toObjectId": "$foodList.foodId"}}
			},
			{
				$lookup: {
					"from": "foods",
					"localField": "foodId",
					"foreignField": "_id",
					"as": "food"
					}
				},
				{
				$unwind: "$food"
			},
			{
				$group: {
					_id: "$_id",
					"foodList": {"$push": "$food"},
				}
			},
			
			{
				$lookup: {
					"from": "packs",
					"localField": "_id",
					"foreignField": "_id",
					"as": "pack"
				}
			},
			{
				$unwind: "$pack"
			},
			
			{
				$lookup: {
					"from": "families",
					"localField": "pack.familyId",
					"foreignField": "_id",
					"as": "family"
				}
			},
			{
				$unwind: "$family"
			},
			{
				$project: {
					"pack.familyId": 0
				}
			},
			{
				$match: {
					"pack._id": new mongoose.Types.ObjectId((req.body._id))
				}
			}
		])
		res.status(200).json(pack[0]);
	})

	filter = catchAsync(async (req: Request, res: Response) => {
		// db.packs.aggregate([{
		// 	$lookup: {
		// 		from: "families",
		// 		localField: "familyId",
		// 		foreignField: "_id",
		// 		as: "family",
		// 	}
		// },
		// {
		// 	"$match": {
		// 		"family.address.city": "Cesena"
		// 	}
		// }
		// ])
		const packs = await PackModel.aggregate([
			{ $lookup: req.body.lookup },
			{ $match: req.body.filter.$match } ]);

		// const packFoodsIds = packs.forEach(p => p.foodList.forEach( (f:any) => f._id ))

		const foodsId = [];
		for (const pack of packs) {
			for (const food of pack.foodList) {
				foodsId.push(food.foodId.toString())
			}
		}
		
		const foods = await FoodModel.find(
			{
				'_id': { $in: foodsId }
			}
		);

		res.status(200).json({"packs": packs, "foods": foods})

	})

	// add = factory.add(PackModel)
	add = catchAsync(async (req: Request, res: Response) => {
		if (!req.body.foodList) {
			res.status(401).json({
				status: "missing-food-error",
				message: "Cannot create a pack without food"
			})
			return
		}

		//creo una mappa <food-id, quantity> per sapere che documenti recuperare
		//dalla collezione foods e di quanto decrementarne il numero di unità
		const foodMap = new Map()
		req.body.foodList.forEach((elem: any) => {
			foodMap.set(elem.foodId, elem.number)
		});

		const idList = Array.from(foodMap.keys())
		//recupero dalla collezione food i documenti da aggiornare
		const foodList = await FoodModel.find({ _id: idList })

		//aggiorno i nodi dei cibi recuperati
		var errorMessage = ""
		foodList.forEach((elem: any) => {
			if (elem.number < foodMap.get(elem.id))
				errorMessage = "Invalid value number in food " + elem.name
			elem.number -= foodMap.get(elem.id)
		});
		if (errorMessage != "") {
			res.status(401).json({
				status: "invalid-food-number-error",
				message: errorMessage
			})
			return
		}

		//aggiorno i documenti nella collezione food
		foodList.forEach(async (doc: any) => {
			await FoodModel.findByIdAndUpdate(doc._id, doc)
		})

		//creo il pacco
		await PackModel.create(req.body).then(r => {
			res.status(200).json(r);
		})

		
	})

	delete = catchAsync(async (req: Request, res: Response) => {
		const pack = await PackModel.findByIdAndDelete({ _id: req.body.id })

		if (!pack) {
			res.status(401).json({
				status: "no-pack-found-error",
				message: "No pack found with this id"
			})
			return
		}

		const foodMap = new Map()
		pack.foodList.forEach((elem: any) => {
			foodMap.set(elem.foodId, elem.number)
		});

		const idList = Array.from(foodMap.keys())
		//recupero dalla collezione food i documenti da aggiornare
		const foodList = await FoodModel.find({ _id: idList })

		//aggiorno i documenti nella collezione food
		foodList.forEach(async (doc: any) => {
			doc.number += foodMap.get(doc.id)
			await FoodModel.findByIdAndUpdate(doc._id, doc)
		})

		// await FoodModel.findById
		res.status(200).json({
			status: "success",
		})

	})

	setDelivered = catchAsync(async (req: Request, res: Response) => {
		if (!req.body.id) {
			res.status(401).json({
				status: "missing-id-error",
				message: "Missing pack id in request body"
			})
			return
		}

		const pack = await PackModel.findById(req.body.id)

		if (!pack) {
			res.status(401).json({
				status: "no-pack-found-error",
				message: "No pack found with id " + req.body.id
			})
			return
		}

		if (pack.status != "planned delivery") {
			res.status(401).json({
				status: "not-advancable-error",
				message: "Cannot change status from " + pack.status + " to delivered"
			})
			return
		}

		pack.status = "delivered"
		await PackModel.findByIdAndUpdate(req.body.id, pack, { new: true })

		res.status(200).json({
			status: "success"
		})

	})

	setPlannedDelivery = catchAsync(async (req: Request, res: Response) => {
		if (!req.body.idList
			|| !req.body.deliveryVolunteerId
			|| !req.body.deliveryDate
			|| !req.body.deliveryPeriod) {
			res.status(401).json({
				status: "missing-id-error",
				message: "Missing pack id list in request body"
			})
			return
		}

		var packList = await PackModel.find({ filter: { _id: req.body.idList } })
		packList.forEach((elem: PackDocument) => {
			elem.deliveryVolunteerId = req.body.volunteerId
			elem.deliveryDate = req.body.deliveryDate
			elem.deliveryPeriod = req.body.deliveryPeriod
			elem.status = "planned delivery"
		})
		await PackModel.updateMany(packList)

		res.status(200).json({
			status: "success"
		})
	})
}