class SignupRes {
    constructor(user) {
        this.name = user?.name;
        this.email = user?.email;
        this.otpSent = true;
    }
}

export default SignupRes;
