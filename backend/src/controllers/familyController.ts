import FamilyModel, { FamilyDocument } from '../models/familyModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FamilyDocument>()

export default class FamilyController {

	find = factory.findMany(FamilyModel)
	add = factory.add(FamilyModel)
	edit = factory.edit(FamilyModel)
	delete = factory.delete(FamilyModel)

}