import User from "../model/User.js";

class UserRepo {
    async findByEmail(email) {
        if (!email) {
            throw new Error("Email is required");
        }

        return await User.findOne({email: email.toLowerCase().trim()});
    }

    async findByPhone(phone) {
        if (!phone) {
            throw new Error("Phone is required");
        }

        return await User.findOne({phone});
    }

    async findByEmailOrPhoneNumber(email, phone) {

        return await User.findOne({
            $or: [
                {email},
                {phone},
            ],
        });
    }

    async save(data) {
        console.log(data);
        if (data?._id) {
            throw new Error("Id must not be specified");
        }

        return await User.create(data);
    }

    async update(id, data) {
        if (!id) {
            throw new Error("ID is required");
        }

        return await User.updateOne({_id: id}, {$set: data});
    }
}

export default new UserRepo();
