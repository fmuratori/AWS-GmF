import { Request, Response } from 'express';
import FamilyModel, { FamilyDocument } from '../models/familyModel';
import catchAsync from '../utils/catchAsync';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FamilyDocument>()

export default class FamilyController {

	find = factory.findMany(FamilyModel)
	add = factory.add(FamilyModel)
	edit = factory.edit(FamilyModel)
	delete = factory.delete(FamilyModel)

	verify = catchAsync(async (req: Request, res: Response) => {
		if (!req.body.id) {
			res.status(401).json({
				status: "missing-id-error",
				message: "Cannot identify the family without the id"
			})
			return
		}

		var family = await FamilyModel.findById(req.body.id)

		if (!family) {
			res.status(401).json({
				status: "family-not-found-error",
				message: "Family with this id doest't exist"
			})
			return
		}

		family.status = "verified"
		FamilyModel.findByIdAndUpdate(req.body.id, family)

		res.status(200).json({
			status: "success",
			message: "Family segnalation verified"
		})
	})
}