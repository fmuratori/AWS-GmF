import { Request, Response } from 'express';
import mongoose from 'mongoose'
import Food from '../models/interfaces/food'
import FoodModel from '../models/foodModel';

class FoodController {

	addFood = async (req: Request, res: Response) => {
		const food = req.body as Food
		console.log(food)

		if(!food){
			console.log("No food in request")
			return
		}

		const newFood = await FoodModel.create(food)
		if(!newFood){
			console.log("Cannot create new food")
		}
		res.status(200).json({
			status: "succes",
			data: {food: newFood}
		})

	}

	// listFood = async (req: Request, res: Response)

}

export default FoodController