import { Request, Response } from 'express';
import FoodModel, { FoodDocument } from '../models/foodModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FoodDocument>()

export default class FoodController {

	find = factory.findMany(FoodModel)

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

	/**
	 * set the number of food to 0
	 */
	delete = catchAsync(async (req: Request, res: Response) => {
		if (!req.body.id) {
			res.status(400).json({
				status: "missing-id-error",
				message: "Missing id of food to delete"
			})
			return
		}

		const elem = await FoodModel.findById(req.body.id)

		if (!elem) {
			res.status(400).json({
				status: "no-food-found-error",
				message: "No food found with id " + req.body.id
			})
			return
		}

		elem.number = 0
		await FoodModel.findByIdAndUpdate(req.body.id, elem)

		res.status(200).json({
			status: "success"
		})
	})
}