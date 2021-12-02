import express, {Router} from 'express'
import PackController from '../controllers/packController'

const router: Router = express.Router()
const packController = new PackController()

router.post('/find', packController.find)

// find one pack gives its id
router.post('/find-expanded', packController.findExpanded)

// filter many packs
router.post('/filter', packController.filter)

// add a new pack to the packs collection
router.post('/add', packController.add)

// edit a pack
router.post('/edit', packController.edit)

// delete a pack
router.post('/delete', packController.delete)

// advance state of the given pack
router.post('/delivered', packController.setDelivered)
router.post('/planned-delivery', packController.setPlannedDelivery)

export default router