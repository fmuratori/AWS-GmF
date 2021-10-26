import FoodModel, { FoodDocument } from '../models/foodModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FoodDocument>()

export default class FoodController {

	add = factory.add(FoodModel)
	listAll = factory.findMany(FoodModel)

}