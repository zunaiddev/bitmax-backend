const allowedOrigins = (process.env.ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

console.log("Allowed Origins:", allowedOrigins);

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};

export default corsOptions;