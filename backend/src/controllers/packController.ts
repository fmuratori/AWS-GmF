import PackModel, { PackDocument } from '../models/packModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<PackDocument>()

export default class PackController {

	get = factory.findMany(PackModel)
	add = factory.add(PackModel)
	edit = factory.add(PackModel)
	delete = factory.delete(PackModel)

}