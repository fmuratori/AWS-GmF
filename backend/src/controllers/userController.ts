import { Request, Response } from 'express';
import UserModel, { UserDocument } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<UserDocument>()

class UserController {

	// listUser = factory.list_all(UserModel)

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

}

export default UserController