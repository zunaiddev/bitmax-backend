function generateOtp() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

export default generateOtp;
