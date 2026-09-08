export const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000
};

function setRefreshCookie(res, refreshToken) {

    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
}

export function clearRefreshCookie(res) {
    res.clearCookie("refreshToken", {
        ...REFRESH_COOKIE_OPTIONS,
        maxAge: 0
    });
}

export default setRefreshCookie;
