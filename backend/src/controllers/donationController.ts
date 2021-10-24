import { Request, Response } from 'express';
import DonationModel, { DonationDocument } from '../models/donationModel'
import Donation from '../models/interfaces/donation';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

export default class DonationController {

	add = factory.add(DonationModel)
	listAll = factory.findMany(DonationModel)

	addMessageInChat = catchAsync(async (req: Request, res: Response) => {
		const donation = await DonationModel.findById(req.body.donationId)
		donation?.chat.push(req.body.chatNode)
		const editedDonation = await DonationModel.findByIdAndUpdate(req.body.donationId)

		res.status(200).json({
			status: "success",
			data: { editedDonation }
		})
	})
}