process.env.JWT_SECRET = "test secret";
import JwtService from "./service/JwtService.js";

const token = JwtService.generateToken(2, "REFRESH", "2s");

setTimeout(() => {
    console.log(JwtService.verifyToken(token, "REFRESH"));
}, 1000);
