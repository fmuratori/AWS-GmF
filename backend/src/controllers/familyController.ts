import FamilyModel, { FamilyDocument } from '../models/familyModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<FamilyDocument>()

export default class FamilyController {

	add = factory.add(FamilyModel)
	edit = factory.edit(FamilyModel)
	listAll = factory.findMany(FamilyModel)

}