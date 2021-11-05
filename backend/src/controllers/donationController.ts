import { Request, Response } from 'express';
import DonationModel, { DonationDocument } from '../models/donationModel'
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

export default class DonationController {

	get = factory.findMany(DonationModel)
	add = factory.add(DonationModel)
	edit = factory.edit(DonationModel)
	delete = factory.delete(DonationModel)

	getChat = catchAsync(async (req: Request, res: Response) => {
		const chat = await DonationModel.findById(req.body.donationId)
			.select("chat")

		res.status(200).json({
			status: "success",
			data: { chat }
		})
	})
}

export async function addMessageToChat(donationId: String, userId: String,fullname: String, message: String) {
	const donation = await DonationModel.findById(donationId)
		.select("+chat")

	if (!donation) {
		console.log("donation not found")
		return
	}

	const newNode: any = {
		userId: userId,
		userFullname: fullname,
		text: message,
		visualized: false
	}
	donation?.chat.push(newNode)
	await DonationModel.findByIdAndUpdate(donationId, donation)

	console.log("message added to chat")
}