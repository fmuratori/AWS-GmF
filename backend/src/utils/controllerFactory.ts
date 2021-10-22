import { Request, Response } from "express"
import { Model } from "mongoose"
import catchAsync from "./catchAsync"

class ControllerFactory<T> {

    add = (model: Model<T>) =>
        catchAsync(async (req: Request, res: Response) => {
            const elem = await model.create(req.body)

            res.status(200).json({
                status: "success",
                data: { elem }
            })
        })

    list_all = (model: Model<T>) =>
        catchAsync(async (req: Request, res: Response) => {
            const list = await model.find()

            res.status(200).json({
                status: "success",
                results: list.length,
                data: { list }
            })
        })
}
export default ControllerFactory