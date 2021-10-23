import FoodModel, { FoodDocument } from '../models/foodModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FoodDocument>()

class FoodController {

	add = factory.add(FoodModel)
	listAll = factory.listAll(FoodModel)

}

export default FoodController