import express, { Router } from 'express'
import DonationController from '../controllers/donationController'

const router: Router = express.Router()
const donationController = new DonationController()

router.post('/find', donationController.find)
router.post('/add', donationController.add)
router.post('/edit', donationController.edit)
router.post('/delete', donationController.delete)

// TODO: move to socketio
router.post('/get-chat', donationController.getChat)
router.post('/unread-messages', donationController.userNonVisualizedMessages)

export default router