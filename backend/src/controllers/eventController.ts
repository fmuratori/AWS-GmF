import EventModel, { EventDocument } from '../models/eventModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<EventDocument>()

class EventController {

	addFood = factory.add(EventModel)
	listFood = factory.list_all(EventModel)

}

export default EventController