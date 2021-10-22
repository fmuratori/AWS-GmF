import UserModel, { UserDocument } from '../models/userModel';
import ControllerFactory from '../utils/controllerFactory';

const factory = new ControllerFactory<UserDocument>()

class UserController {

	addUser = factory.add(UserModel)
	listUser = factory.list_all(UserModel)

}

export default UserController