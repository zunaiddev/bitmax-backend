import jwt from "jsonwebtoken";

class JwtService {
    generateToken(id, purpose, expiresIn) {
        return jwt.sign({id, purpose}, "temp-secret-temp-secret", {expiresIn});
    }
}

export default new JwtService();
