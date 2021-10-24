import DonationModel, { DonationDocument } from '../models/donationModel'
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

export default class DonationController {

	add = factory.add(DonationModel)
	listAll = factory.findMany(DonationModel)

}