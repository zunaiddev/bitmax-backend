class UserResponse {
    constructor(user) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.phone = user.phone;
        this.isEmailVerified = user.isEmailVerified;
        this.isPhoneVerified = user.isPhoneVerified;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }
}

export default UserResponse;