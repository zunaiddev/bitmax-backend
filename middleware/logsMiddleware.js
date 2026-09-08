function logsMiddleware(req, res, next) {
    console.log("Request received");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl || req.url, "\n\n");
    next();
}

export default logsMiddleware;