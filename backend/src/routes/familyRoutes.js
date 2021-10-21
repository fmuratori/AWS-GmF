module.exports = function(app) {
	var familyController = require('../controllers/familyController');

	// app.route('/')
	// 	.get(moviesController.show_index);

	// app.route('/movies-crud')
	// 	.get(moviesController.show_crud);
		
	app.route('/api/family')
		.get(familyController.list_family)
		.post(familyController.create_family);

	// app.route('/api/movies/:id')
	// 	.get(moviesController.read_movie)
	// 	.put(moviesController.update_movie)
	// 	.delete(moviesController.delete_movie);
};
