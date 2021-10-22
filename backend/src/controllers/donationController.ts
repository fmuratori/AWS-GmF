import DonationModel, { DonationDocument } from '../models/donationModel'
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<DonationDocument>()

class DonationController {

	addDonation = factory.add(DonationModel)
	listDonation = factory.list_all(DonationModel)

}

export default DonationController