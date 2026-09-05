import jwt from "jsonwebtoken";

class JwtService {
    generateToken(id, purpose, expiresIn) {
        return jwt.sign({id, purpose}, "temp-secret-temp-secret", {expiresIn});
    }

    verifyToken(token) {
        return jwt.verify(token, "temp-secret-temp-secret");
    }
}

export default new JwtService();
