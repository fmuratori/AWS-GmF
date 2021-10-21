module.exports = function(app) {
	var packController = require('../controllers/packController');

	// app.route('/')
	// 	.get(moviesController.show_index);

	// app.route('/movies-crud')
	// 	.get(moviesController.show_crud);
		
	app.route('/api/pack')
		.get(packController.list_pack)
		.post(packController.create_pack);

	// app.route('/api/movies/:id')
	// 	.get(moviesController.read_movie)
	// 	.put(moviesController.update_movie)
	// 	.delete(moviesController.delete_movie);
};
