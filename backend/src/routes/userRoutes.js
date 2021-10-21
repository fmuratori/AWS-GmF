module.exports = function(app) {
	var userController = require('../controllers/userController');

	// app.route('/')
	// 	.get(moviesController.show_index);

	// app.route('/movies-crud')
	// 	.get(moviesController.show_crud);
		
	app.route('/api/user')
		.get(userController.list_user)
		.post(userController.create_user);

	// app.route('/api/movies/:id')
	// 	.get(moviesController.read_movie)
	// 	.put(moviesController.update_movie)
	// 	.delete(moviesController.delete_movie);
};
