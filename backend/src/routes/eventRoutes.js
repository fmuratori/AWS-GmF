module.exports = function(app) {
	var eventController = require('../controllers/eventController');

	// app.route('/')
	// 	.get(moviesController.show_index);

	// app.route('/movies-crud')
	// 	.get(moviesController.show_crud);
		
	app.route('/api/event')
		.get(eventController.list_event)
		.post(eventController.create_event);

	// app.route('/api/movies/:id')
	// 	.get(moviesController.read_movie)
	// 	.put(moviesController.update_movie)
	// 	.delete(moviesController.delete_movie);
};
