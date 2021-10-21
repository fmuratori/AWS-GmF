const mongoose = require('mongoose');
Food = require("../models/foodModel.js").default(mongoose);

// exports.show_index = function(req, res) {
// 	res.sendFile(appRoot  + '/www/movies.html');
// };

// exports.show_crud = function(req, res) {
// 	res.sendFile(appRoot  + '/www/movies-crud.html');
// };

exports.list_food = function(req, res) {
	Food.find({}, function(err, food) {
		if (err)
			res.send(err);
		res.json(food);
	});
};


exports.create_food = function(req, res) {
	var new_food = new Food(req.body);
	new_food.save(function(err, food) {
		if (err)
			res.send(err);
		res.status(201).json(food);
	});
};


// exports.read_movie = function(req, res) {
// 	/*
// 	TODO cast req.params.id to ObjectId
// 	*/
// 	Movie.findById(req.params.id, function(err, movie) {
// 		if (err)
// 			res.send(err);
// 		else{
// 			if(movie==null){
// 				res.status(404).send({
// 					description: 'Movie not found'
// 				});
// 			}
// 			else{
// 				res.json(movie);
// 			}
// 		}
// 	});
// };

// exports.create_movie = function(req, res) {
// 	var new_movie = new Movie(req.body);
// 	new_movie.save(function(err, movie) {
// 		if (err)
// 			res.send(err);
// 		res.status(201).json(movie);
// 	});
// };

// exports.update_movie = function(req, res) {
// 	Movie.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, movie) {
// 		if (err)
// 			res.send(err);
// 		else{
// 			if(movie==null){
// 				res.status(404).send({
// 					description: 'Movie not found'
// 				});
// 			}
// 			else{
// 				res.json(movie);
// 			}
// 		}
// 	});
// };

// exports.delete_movie = function(req, res) {
// 	Movie.deleteOne({_id: req.params.id}, function(err, result) {
// 		if (err)
// 			res.send(err);
// 		else{
// 			if(result.deletedCount==0){
// 				res.status(404).send({
// 					description: 'Movie not found'
// 				});
// 			}
// 			else{
// 				res.json({ message: 'Task successfully deleted' });
// 			}
// 		}
//   });
// };
