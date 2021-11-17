import express, {Router} from 'express'
import UserController from '../controllers/userController'

const router: Router = express.Router()
const userController = new UserController()

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/get-data', userController.getData)
router.post('/update', userController.update)
router.post('/upgrade', userController.upgrade)
router.post('/change-password', userController.changePassword)

export default router