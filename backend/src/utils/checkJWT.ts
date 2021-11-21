import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./tokenHandler";
const NO_JWT_PATH = [
    "/api/user/register",
    "/api/user/login",
    "/api/food/get-chart-data",
    "/api/event/find"
]

export default (req: Request, res: Response, next: NextFunction) => {
    if (process.env.USE_JWT === "false") {
        next()
        return
    }

    const token = req.headers["x-access-token"]
    const userId = req.headers["x-user-id"]

    //se l'utente deve loggarsi/registrarsi non controllo il token
    if (NO_JWT_PATH.indexOf(req.path) == -1) {

        //l'utente deve autenticarsi col token se non sta chiamando l'endpoint di login o di registrazione 
        if (!token) {
            res.status(401).json({
                "status": "missing-token-error",
                "message": "Missing token in header x-access-token"
            })
            return
        }

        //per la verifica del token bisogna passare anche l'id dell'utente nel body della chaiamata
        if (!userId) {
            res.status(401).json({
                "status": "missing-id-error",
                "message": "Missing user id in header x-user-id"
            })
            return
        }

        //validazione del token
        if (!verifyToken("" + token, "" + userId)) {
            res.status(401).json({
                "status": "wrong-token-error",
                "message": "Wrong token"
            })
            return
        }
    }

    next()

}