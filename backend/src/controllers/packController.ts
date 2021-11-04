import PackModel, { PackDocument } from '../models/packModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<PackDocument>()

export default class PackController {

	add = factory.add(PackModel)
	edit = factory.add(PackModel)
	listAll = factory.findMany(PackModel)

}