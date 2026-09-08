import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRouter from "./routes/AuthRoutes.js";
import userRouter from "./routes/UserRoutes.js";
import CustomError from "./exception/CustomError.js";
import mongooseConfig from "./config/mongooseConfig.js";
import logsMiddleware from "./middleware/logsMiddleware.js";
import corsOptions from "./utils/corsOptions.js";

const app = express();

mongooseConfig();

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use(logsMiddleware);

app.get('/', (req, res) => {
    return res.send('Welcome to the server');
});

app.use(authRouter);
app.use(userRouter);

app.use(function (err, req, res, _) {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({
            code: err.code,
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
