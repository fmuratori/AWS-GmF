import FamilyModel, { FamilyDocument } from '../models/familyModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FamilyDocument>()

class FamilyController {

	addFamily = factory.add(FamilyModel)
	listFamily = factory.list_all(FamilyModel)

}

export default FamilyController