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
		const foodList = await FoodModel.find();
		var meatCount = 0
		var fishCount = 0
		var pastaCount = 0
		var vegetableCount = 0
		var fruitCount = 0

		foodList.forEach((elem: FoodDocument) => {
			if (elem.labels.indexOf("meat") != -1) meatCount += elem.number
			if (elem.labels.indexOf("fish") != -1) fishCount += elem.number
			if (elem.labels.indexOf("pasta") != -1) pastaCount += elem.number
			if (elem.labels.indexOf("vegetable") != -1) vegetableCount += elem.number
			if (elem.labels.indexOf("fruit") != -1) fruitCount += elem.number
		});

		res.status(200).json({
			meat: meatCount,
			fish: fishCount,
			pasta: pastaCount,
			vegetable: vegetableCount,
			fruit: fruitCount
		})
	})
}