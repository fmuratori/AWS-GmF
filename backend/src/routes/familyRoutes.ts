import express, {Router} from 'express'
import FamilyController from '../controllers/familyController'

const router: Router = express.Router()
const familyController = new FamilyController()

router.post('/find', familyController.find)
router.post('/add', familyController.add)
router.post('/edit', familyController.edit)
router.post('/delete', familyController.delete)

router.post('/verify', familyController.verify)

export default router