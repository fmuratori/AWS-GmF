import EventModel, { EventDocument } from '../models/eventModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<EventDocument>()

export default class EventController {

	find = factory.findMany(EventModel)
	add = factory.add(EventModel)
	edit = factory.edit(EventModel)
	delete = factory.delete(EventModel)

}