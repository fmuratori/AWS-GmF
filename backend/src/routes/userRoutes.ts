import express, {Router} from 'express'
import UserController from '../controllers/userController'

const router: Router = express.Router()
const userController = new UserController()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/update', userController.update)
router.get('/upgrade', userController.upgrade)

export default router