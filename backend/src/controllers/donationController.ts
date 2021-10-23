import DonationModel, { DonationDocument } from '../models/donationModel'
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

class DonationController {

	add = factory.add(DonationModel)
	listAll = factory.listAll(DonationModel)

}

export default DonationController