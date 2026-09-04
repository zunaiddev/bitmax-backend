import express from 'express';
import authRouter from "./routes/AuthRoutes.js";
import CustomError from "./exception/CustomError.js";
import mongooseConfig from "./config/mongooseConfig.js";

const app = express();

mongooseConfig();

app.use(express.json());

console.log(process.env.EMAIL_PASS);

app.get('/', (req, res) => {
    return res.send('Welcome to the server');
});

app.use(authRouter);

app.use(function (err, req, res, _) {
    if (err instanceof CustomError) {
        return res.status(err.code).send({
            message: err.message,
            details: err.details
        });
    }

    console.log(err);

    return res.status(500).send({
        message: 'Internal Server Error'
    });
});

app.listen(5000, function () {
    console.log('Listening on port 5000');
});