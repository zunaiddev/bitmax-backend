function setRefreshCookie(res, refreshToken) {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
}

export default setRefreshCookie;