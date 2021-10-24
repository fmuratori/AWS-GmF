import express, {Router} from 'express'
import DonationController from '../controllers/donationController'

const router: Router = express.Router()
const donationController = new DonationController()

router.get('/list-all', donationController.listAll)
router.post('/add', donationController.add)
router.post('/add-message', donationController.addMessage)

export default router