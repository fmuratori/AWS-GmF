import jwt from 'jsonwebtoken'

const createToken = (userId: String) => {
    const token = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET_KEY || "missing secret token",
        { expiresIn: process.env.JWT_EXPIRES_IN || "12h" }
    )
    return token
}

const verifyToken = (token: String, uid: String) => {
    try {
        const decodedToken = jwt
            .verify("" + token, process.env.JWT_SECRET_KEY || "missing secret token")
        const { userId } = (decodedToken as jwt.JwtPayload)

        if (uid === userId) return true
        return false

    } catch (e) { return false }
}

export { verifyToken, createToken }