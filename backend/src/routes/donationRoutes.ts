import express, {Router} from 'express'
import DonationController from '../controllers/donationController'

const router: Router = express.Router()
const donationController = new DonationController()

router.get('/list-all', donationController.listDonation)
router.post('/add', donationController.addDonation)

export default router