import { Request, Response } from "express"
import { FilterQuery, Model } from "mongoose"
import catchAsync from "./catchAsync"

export default class ControllerFactory<T> {

    /**
     * add a new document in the collection
     * @param model mongoose model
     * @returns the new document inserted
     */
    add = (model: Model<T>) =>
        catchAsync(async (req: Request, res: Response) => {
            const elem = await model.create(req.body)

            res.status(200).json({
                status: "success"
            })
        })

    /**
     * @param model mongoose model
     * @returns all document in the collection
     * optional req.body.filter: {filterObject:X}
     * optional req.body.projection: {projectionObject:Y}
     * optional req.body.sortBy: {sortingParam:Z}
     * X=1 -> ascending order, x=-1 -> descending order
     * optional req.body.pageSize: Int -> numero di documenti per pagina
     * optional req.body.page: Int -> indice della pagina desiderata
     */
    findMany = (model: Model<T>) =>
        catchAsync(async (req: Request, res: Response) => {
            const list = await model
                .find(req.body.filter, req.body.projection)
                .sort(req.body.sortBy)
                .skip(req.body.page * req.body.pageSize)
                .limit(req.body.pageSize)

            res.status(200).json({
                status: "success",
                results: list.length,
                data: { list }
            })
        })

    findOne = (model: Model<T>, filter: FilterQuery<T>, projection: any | null) =>
        catchAsync(async (req: Request, res: Response) => {
            const elem = await model.findOne(filter, projection)

            if (!elem) {
                res.status(401).json({
                    status: "no-elem-found-error",
                    message: "No element found"
                })
                return
            }

            res.status(200).json({
                status: "success",
                data: { elem }
            })
        })
}