import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import catchAsync from '../utils/catchAsync';

class UserController {

	register = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({ username: req.body.username })

		if (user) {
			console.log("user already exist")
			return
		}

		const newUser = await UserModel.create(req.body)
		console.log("added user")

		res.status(200).json({
			status: "success",
			data: { newUser }
		})
	})

	login = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({
			username: req.body.username,
			password: req.body.password
		})

		if (!user) {
			console.log("login failed")
			return
		}

		res.status(200).json({
			status: "success",
			data: { user }
		})

	})

	update = catchAsync(async (req: Request, res: Response) => {
		var user = await UserModel.findById(req.body._id)

		if (!user) {
			console.log("user not found")
			return
		}

		if(req.body.name) user.name = req.body.name
		if(req.body.surname) user.surname = req.body.surname
		if(req.body.username) user.username = req.body.username
		if(req.body.password) user.password = req.body.password
		if(req.body.email) user.email = req.body.email
		if(req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber
		if(req.body.type) user.type = req.body.type
		if(req.body.address) user.address = req.body.address

		const updatedUser = await UserModel.findByIdAndUpdate(user._id, user)
		
		res.status(200).json({
			status: "success",
			data: { updatedUser }
		})
	})
}

export default UserController