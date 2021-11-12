import { Request, Response } from 'express';
import DonationModel, { DonationDocument } from '../models/donationModel'
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

export default class DonationController {

	find = factory.findMany(DonationModel)
	add = factory.add(DonationModel)
	edit = factory.edit(DonationModel)
	delete = factory.delete(DonationModel)

	getChat = catchAsync(async (req: Request, res: Response) => {
		// retrieve donation by id and linked chat
		const donation = await DonationModel.findById(req.body.donationId, { "chat": 1 })
		if (!donation) {
			console.log("donation not found")
			return
		}

		// upadte visualized messages (messages writted my another user)
		donation.chat.forEach(elem => {
			if (elem.userId != req.body.userId)
				elem.visualized = true;
		})
		await DonationModel.findByIdAndUpdate(req.body.donationId, donation)

		res.status(200).json(donation.chat)
	})

	userNonVisualizedMessages = catchAsync(async (req: Request, res: Response) => {
		const userId: string = req.body.userId;
		const counts = await DonationModel.find({
			"userId": userId,
			"chat": {
				"$elemMatch": {
					"visualized": false,
					"userId": {
						"$ne": userId
					}
				}
			}
		}, {
			"donationId": 1,
			"chat.$": 1
		})

		if (!counts) {
			console.log("user donations not found")
			return
		}

		res.status(200).json(counts)
	})
}

export async function addMessageToChat(donationId: String, userId: String, fullname: String, message: String) {
	const donation = await DonationModel.findById(donationId)
		.select("+chat")

	if (!donation) {
		console.log("donation not found")
		return
	}

	donation?.chat.push({
		index: donation?.chat.length,
		userId: userId,
		userFullname: fullname,
		text: message,
		visualized: false,
		date: new Date()
	})

	await DonationModel.findByIdAndUpdate(donationId, donation)

	const newMessage = donation.chat[donation?.chat.length - 1]
	return { message: newMessage, _id: donationId }
}

export async function getDonationUsers(donationId: String) {

	// l'utente ha inviato un messaggio => devo avvisare il volontario incaricato
	const donation = await DonationModel.findById(donationId)

	// è stato inviato un messaggio per una donazione inesistente (non dovrebbe accadere mai)
	if (!donation) {
		console.log("donation not found")
		return
	} else {
		return {
			"volunteerId": donation.pickUp.volunteerId,
			"userId": donation.userId
		}
	}
}

export async function setMessageAsVisualized(donationId: String, messageIndex: Number) {

	const donation = await DonationModel.findById(donationId)
		.select("+chat")

	if (!donation) {
		console.log("donation not found")
		return
	}

	donation.chat.find(msg => msg.index == messageIndex)!.visualized = true;

	console.log("message visualized", donation.chat.find(msg => msg.index == messageIndex))

	await DonationModel.findByIdAndUpdate(donationId, donation)
}