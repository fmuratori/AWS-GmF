import { Request, Response } from 'express';
import FoodModel, { FoodDocument } from '../models/foodModel';
import FamilyModel from '../models/familyModel';
import PackModel from '../models/packModel';
import EventModel from '../models/eventModel';
import catchAsync from '../utils/catchAsync';

/**
 * class for retrieving data for chart and homepage components
 */
export default class DataController {

	getFoodLabelsData = catchAsync(async (req: Request, res: Response) => {
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

	getNextEvents = catchAsync(async (req: Request, res: Response) => {
		const nextEvents = await EventModel.find({ date: { $gte: new Date } })

		res.status(200).json(nextEvents)
	})

	getCountsData = catchAsync(async (req: Request, res: Response) => {
		const foodAggregate = await FoodModel.aggregate([
			{ $group: { _id: "all", count: { $sum: "$number" } } }
		])

		const familyAggregate = await FamilyModel.aggregate([
			// select only verified families
			{ $match: { status: "verified" } },
			// merge families and count them
			{ $group: { _id: "all", count: { $sum: 1 } } }
		])

		const packAggregate = await PackModel.aggregate([
			// select only delivered packs
			{ $match: { status: "delivered" } },
			// merge packs and count them
			{ $group: { _id: "all", count: { $sum: 1 } } }
		])

		const foodCount = (foodAggregate.length == 0) ? 0 : foodAggregate[0].count
		const familyCount = (familyAggregate.length == 0) ? 0 : familyAggregate[0].count
		const packCount = (packAggregate.length == 0) ? 0 : packAggregate[0].count

		res.status(200).json({
			foodCount: foodCount,
			verifiedFamilies: familyCount,
			deliveredPacks: packCount
		})
	})
}