import JwtService from "./service/JwtService.js";


console.log(JwtService.generateToken(24, "AUTH", "30d"));