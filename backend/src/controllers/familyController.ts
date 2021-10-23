import FamilyModel, { FamilyDocument } from '../models/familyModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FamilyDocument>()

class FamilyController {

	add = factory.add(FamilyModel)
	listAll = factory.findMany(FamilyModel)

}

export default FamilyController