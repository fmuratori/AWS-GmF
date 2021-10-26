import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt'
import validator from 'validator'
const ROUND_NUMBER = 5

export default class UserController {

	register = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({ username: req.body.username })

		if (user) {
			console.log("user already exist")
			return
		}

		if(!validator.isStrongPassword(req.body.password)){
			console.log("user must insert a strong password")
			return
		}

		const hashPassword = bcrypt.hashSync(req.body.password, ROUND_NUMBER)
		req.body.hashPassword = hashPassword

		const newUser = await UserModel.create(req.body)
		console.log("added user")

		res.status(200).json({
			status: "success",
			data: { newUser }
		})
	})

	login = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({
			username: req.body.username
		}).select("+hashPassword")

		if (!user) {
			console.log("login failed")
			return
		}

		if(!bcrypt.compareSync(req.body.password, ""+user.hashPassword)){
			console.log("wrong password")
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

		if (req.body.name) user.name = req.body.name
		if (req.body.surname) user.surname = req.body.surname
		if (req.body.username) user.username = req.body.username
		if (req.body.email) user.email = req.body.email
		if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber
		if (req.body.type) user.type = req.body.type
		if (req.body.address) user.address = req.body.address

		const updatedUser = await UserModel.findByIdAndUpdate(user._id, user)

		res.status(200).json({
			status: "success",
			data: { updatedUser }
		})
	})

	// private async saltPassword(password: String): Object {
	// 	await bcrypt.genSalt(SALT_ROUND, async (err, salt) => {
	// 		await bcrypt.hash(password, salt, (err, hash) => {
	// 			return {hash: hash, seed: salt}
	// 		})
	// 	})
	// }
}