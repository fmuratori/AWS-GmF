import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import FoodModel, { FoodDocument } from '../models/foodModel';
import PackModel, { PackDocument } from '../models/packModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<PackDocument>()

export default class PackController {

	find = factory.findMany(PackModel)

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
		await PackModel.create(req.body)

		// await FoodModel.findById
		res.status(200).json({
			status: "success",
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