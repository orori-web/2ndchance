const validateKenyanPhone = (phone) => {
    // Remove spaces, hyphens and other separators
    let cleanedPhone = phone.replace(/\D/g, "");

    // Convert 07XXXXXXXX to 2547XXXXXXXX
    if (cleanedPhone.startsWith("0")) {
        cleanedPhone = "254" + cleanedPhone.substring(1);
    }

    // Validate Kenyan mobile number
    const phoneRegex = /^254[17]\d{8}$/;

    if (!phoneRegex.test(cleanedPhone)) {
        throw new Error("Invalid Kenyan phone number.");
    }

    return cleanedPhone;
};

module.exports = validateKenyanPhone;