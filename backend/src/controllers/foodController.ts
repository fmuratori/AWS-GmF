import { Request, Response } from 'express';
import FoodModel, { FoodDocument } from '../models/foodModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory'; 

const factory = new ControllerFactory<FoodDocument>()

export default class FoodController {

	find = factory.findMany(FoodModel)
	add = factory.add(FoodModel)
	delete = factory.delete(FoodModel)

	addOrUpdate = catchAsync(async (req: Request, res: Response) => {
		var elem = await FoodModel.findOne({
			name: req.body.name,
			expirationDate: req.body.expirationDate
		})

		if (!elem) {
			//creo un nuovo nodo
			elem = await FoodModel.create(req.body)
		} else {
			//aggiorno il nodo già esistente
			if (req.body.number) {
				elem.number += parseInt(req.body.number)
			}
			elem = await FoodModel.findByIdAndUpdate(elem._id, elem, { new: true })
		}

		res.status(200).json(elem)

	})

	getChartData = catchAsync(async (req: Request, res: Response) => {
		const list = await FoodModel.find();

		const meat = list.filter((e: FoodDocument) => e.labels.indexOf("meat") != -1)
		const fish = list.filter((e: FoodDocument) => e.labels.indexOf("fish") != -1)
		const pasta = list.filter((e: FoodDocument) => e.labels.indexOf("pasta") != -1)
		const vegetable = list.filter((e: FoodDocument) => e.labels.indexOf("vegetable") != -1)
		const fruit = list.filter((e: FoodDocument) => e.labels.indexOf("fruit") != -1)

		res.status(200).json({
			meat: meat.length,
			fish: fish.length,
			pasta: pasta.length,
			vegetable: vegetable.length,
			fruit: fruit.length
		})
	})
}