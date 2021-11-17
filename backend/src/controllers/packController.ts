import { Request, Response } from 'express';
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

	advanceStatus = catchAsync(async (req: Request, res: Response) => {
		const pack = await PackModel.findById(req.body.id)

		if (!pack) {
			res.status(401).json({
				status: "no-pack-found-error",
				message: "No pack found with this id"
			})
			return
		}

		switch (pack.status) {
			case "ready":
				pack.status = "planned delivery"
				break
			case "planned delivery":
				pack.status = "delivered"
				break
			default:
				res.status(401).json({
					status: "no-advancable-statu-error",
					message: "Pack isn't in an advancable status"
				})
				return
		}

		await PackModel.findByIdAndUpdate(req.body.id, pack)

		res.status(200).json({
			status: "success",
		})

	})

}