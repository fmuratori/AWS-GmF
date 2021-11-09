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

		if(!elem){
			console.log("creo un nuovo nodo")
			//creo un nuovo nodo
			elem = await FoodModel.create(req.body)
		} else {
			console.log("aggiorno il nodo esistente")
			//aggiorno il nodo già esistente
			if(req.body.number) {
				console.log("aggiungo " + req.body.number)
				elem.number += req.body.number}
			else {
				console.log("aggiungo 1")
				elem.number = elem.number.valueOf() + 1
			}
			elem = await FoodModel.findByIdAndUpdate(elem._id, elem, {new: true})
		}

		res.status(200).json({
			status: "success",
			data: {elem}
		})

	})

}