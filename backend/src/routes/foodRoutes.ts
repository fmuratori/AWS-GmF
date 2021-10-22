import express, {Router} from 'express'
import FoodController from '../controllers/foodController'

// module.exports = function(app) {
// 	var foodController = require('../controllers/foodController');

	// app.route('/')
	// 	.get(moviesController.show_index);

	// app.route('/movies-crud')
	// 	.get(moviesController.show_crud);
		
	// app.route('/api/food')
	// 	.get(foodController.list_food)
	// 	.post(foodController.create_food);

	// app.route('/api/movies/:id')
	// 	.get(moviesController.read_movie)
	// 	.put(moviesController.update_movie)
	// 	.delete(moviesController.delete_movie);
// };

const foodRouter: Router = express.Router()
const foodController = new FoodController()

foodRouter.post('/add', foodController.addFood)

export default foodRouter