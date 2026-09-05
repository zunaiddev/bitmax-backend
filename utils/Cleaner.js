class Cleaner {
    static cleanName(name) {
        if (name == null) {
            return "";
        }

        return String(name).trim().replace(/\s+/g, " ");
    }

    static cleanEmail(email) {
        if (email == null) {
            return "";
        }

        return String(email).trim().toLowerCase();
    }

    static cleanPhone(phone) {
        if (phone == null) {
            return "";
        }

        const value = String(phone).trim();

        return value
            .replace(/[()\s.-]/g, "")
            .replace(/(?!^)\+/g, "");
    }

    static cleanOtp(code) {
        if (code == null) {
            return "";
        }

        return code.trim().replaceAll(" ", "");
    }
}

export default Cleaner;
