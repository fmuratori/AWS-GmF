import FoodModel, { FoodDocument } from '../models/foodModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FoodDocument>()

class FoodController {

	addFood = factory.add(FoodModel)
	listFood = factory.list_all(FoodModel)

}

export default FoodController