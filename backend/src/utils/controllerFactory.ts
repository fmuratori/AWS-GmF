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
            //create a new document
            await model.create(req.body)

            res.status(200).json({
                status: "success"
            })
        })

    /**
     * edit an existing document in the collection
     * document is passad via id in the body of the request
     * the rest of the body should contain all the document field,
     * even those that don't need to be modified 
     * @param model mongoose model
     * @returns 
     */
    edit = (model: Model<T>) =>
        catchAsync(async (req: Request, res: Response) => {
            // if (!req.body.id) {
            if (!req.body._id) {
                res.status(400).json({
                    status: "missing-id-error",
                    message: "Missing id of document to edit"
                })
                return
            }
            
            // TODO: verificare se _id rompe qualcosa
            // const elem = await model.findByIdAndUpdate(req.body.id, req.body, {new: true})
            const elem = await model.findByIdAndUpdate(req.body._id, req.body, {new: true})
            console.log(elem)

            res.status(200).json({
                status: "success"
            })
        })

    delete = (model: Model<T>) => 
        catchAsync(async (req: Request, res: Response) => {
            if (!req.body.id) {
                res.status(400).json({
                    status: "missing-id-error",
                    message: "Missing id of document to edit"
                })
                return
            }

            const elem = await model.findByIdAndDelete(req.body.id)
            console.log(elem)

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