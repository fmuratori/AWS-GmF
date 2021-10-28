import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createToken } from '../utils/tokenHandler';

export default class UserController {

	register = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({ username: req.body.username })

		if (user) {
			res.status(401).json({
				status: "user-exist-error",
				message: "User already exist"
			})
			return
		}

		if (!validator.isStrongPassword(req.body.password)) {
			res.status(401).json({
				status: "weak-password-error",
				message: "User must insert a strong password"
			})
			return
		}

		const hashPassword = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND_NUMBER || "10"))
		req.body.hashPassword = hashPassword

		//add user to collection
		const newUser = await UserModel.create(req.body)

		const token = createToken(newUser._id)

		res.status(200).json({
			status: "success",
			data: { 
				user: await UserModel.findById(newUser._id), 
				token: token }
		})
	})

	login = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({
			username: req.body.username
		}).select("+hashPassword")


		if (!user) {
			res.status(401).json({
				status: "no-user-error",
				message: "User not found"
			})
			return
		}

		if (!bcrypt.compareSync(req.body.password, "" + user.hashPassword)) {
			res.status(401).json({
				status: "wrong-credntials-error",
				message: "Wrong credential"
			})
			return
		}

		const token = createToken(user._id)

		res.status(200).json({
			status: "success",
			data: { 
				user: await UserModel.findById(user._id),
				token: token }
		})
	})

	update = catchAsync(async (req: Request, res: Response) => {
		var user = await UserModel.findById(req.body._id)

		if (!user) {
			res.status(401).json({
				status: "user-not-found-error",
				message: "user not found"
			})
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