import express, { Router } from 'express'
import DonationController from '../controllers/donationController'

const router: Router = express.Router()
const donationController = new DonationController()

router.get('/list-all', donationController.listAll)
router.post('/add', donationController.add)
router.post('/edit', donationController.edit)
router.get('/get-chat', donationController.getChat)

export default router