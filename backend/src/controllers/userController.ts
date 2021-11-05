import { Request, Response } from 'express';
import UserModel from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import bcrypt from 'bcrypt'
import validator from 'validator'
import { createToken } from '../utils/tokenHandler';

export default class UserController {

	register = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({ email: req.body.email })

		if (user) {
			res.status(401).json({
				status: "user-exist-error",
				message: "User with same mail already exist"
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
		await UserModel.create(req.body)

		res.status(200).json({
			status: "success"
		})
	})

	login = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findOne({
			email: req.body.email
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
				token: token
			}
		})
	})

	update = catchAsync(async (req: Request, res: Response) => {
		var user = await UserModel.findById(req.body.userId)

		if (!user) {
			res.status(401).json({
				status: "user-not-found-error",
				message: "user not found"
			})
			return
		}

		if (req.body.name) user.name = req.body.name
		if (req.body.surname) user.surname = req.body.surname
		if (req.body.email) user.email = req.body.email
		if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber
		if (req.body.address) user.address = req.body.address

		const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, { new: true })
		console.log(updatedUser)

		res.status(200).json({
			status: "success",
			message: "User updated"
		})
	})

	//upgrade user to volunteer type
	upgrade = catchAsync(async (req: Request, res: Response) => {
		var user = await UserModel.findById(req.body.userId)

		if (!user) {
			res.status(401).json({
				status: "user-not-found-error",
				message: "User not found"
			})
			return
		}

		if (user.type != "user") {
			res.status(401).json({
				status: "user-type-error",
				message: "Cannot upgrade " + user.type + " user"
			})
			return
		}

		user.type = "volunteer"

		const upgradedUser = await UserModel.findByIdAndUpdate(user._id, user, { new: true })
		console.log(upgradedUser)

		res.status(200).json({
			status: "success",
			message: "User upgraded"
		})

	})

	changePassword = catchAsync(async (req: Request, res: Response) => {
		const user = await UserModel.findById(req.body.id)
			.select("+hashPassword")

		if (!user) {
			res.status(401).json({
				status: "user-not-found-error",
				message: "User not found"
			})
			return
		}

		if (!bcrypt.compareSync(req.body.oldPassword, "" + user.hashPassword)) {
			res.status(401).json({
				status: "wrong-password-error",
				message: "Old password is not correct"
			})
			return
		}

		if (!validator.isStrongPassword(req.body.newPassword)) {
			res.status(401).json({
				status: "weak-password-error",
				message: "User must insert a strong password"
			})
			return
		}

		const hashPassword = bcrypt.hashSync(req.body.newPassword, parseInt(process.env.SALT_ROUND_NUMBER || "10"))
		user.hashPassword = hashPassword

		await UserModel.findByIdAndUpdate(user._id, user)

	})
}