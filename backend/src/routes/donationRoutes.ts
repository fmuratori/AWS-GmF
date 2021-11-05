import express, { Router } from 'express'
import DonationController from '../controllers/donationController'

const router: Router = express.Router()
const donationController = new DonationController()

router.get('/', donationController.get)
router.post('/', donationController.add)
router.put('/', donationController.edit)
router.delete('/', donationController.delete)

router.get('/get-chat', donationController.getChat)

export default router