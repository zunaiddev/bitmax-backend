function formatIp(ip) {
    return ip.replace(/^::ffff:/, "");
}

function parseOsName(userAgent) {
    if (/windows/i.test(userAgent)) {
        return "Windows";
    }

    if (/android/i.test(userAgent)) {
        return "Android";
    }

    if (/iphone|ipad|ipod/i.test(userAgent)) {
        return "iOS";
    }

    if (/ubuntu/i.test(userAgent)) {
        return "Ubuntu";
    }

    if (/mac os x|macintosh/i.test(userAgent)) {
        return "macOS";
    }

    if (/cros/i.test(userAgent)) {
        return "Chrome OS";
    }

    if (/linux/i.test(userAgent)) {
        return "Linux";
    }

    return "Unknown";
}

function transformSessions(rawSessions) {
    return rawSessions.map((session) => {
        const date = session.createdAt
            ? new Date(session.createdAt).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
            })
            : "Unknown";

        return {
            id: session._id,
            ip: formatIp(session.deviceIp),
            name: parseOsName(session.deviceName),
            date,
            type: session.deviceType,
        };
    });
}

export default transformSessions;