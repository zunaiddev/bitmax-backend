function getDeviceInfo(req) {
    const userAgent = req.headers["user-agent"] || "Unknown";

    return {
        deviceIp: (req.headers["x-forwarded-for"] || req.ip || "").split(",")[0].trim(),
        userAgent,
        deviceType: /mobile|android|iphone|ipad/i.test(userAgent) ? "mobile" : "desktop",
        deviceName: userAgent
    }
}

export default getDeviceInfo;