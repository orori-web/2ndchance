const User = require("../models/User");

/**
 * Find an existing user by Google ID.
 */
const findUserByGoogleId = async (googleId) => {
    return await User.findOne({ googleId });
};

/**
 * Find an existing user by email.
 */
const findUserByEmail = async (email) => {
    return await User.findOne({
        email: email.toLowerCase(),
    });
};

/**
 * Create a new user from a Google profile.
 */
const createGoogleUser = async (profile) => {
    const email = profile.emails[0].value.toLowerCase();

    const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase())
        : [];

    return await User.create({
        googleId: profile.id,
        fullName: profile.displayName,
        email,
        profilePicture: profile.photos?.[0]?.value || "",
        role: adminEmails.includes(email) ? "admin" : "customer",
        lastLogin: new Date(),
    });
};

/**
 * Update user information after a successful Google login.
 */
const updateGoogleUser = async (user, profile) => {
    const email = profile.emails[0].value.toLowerCase();

    const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(",").map((email) => email.trim().toLowerCase())
        : [];

    user.fullName = profile.displayName;
    user.email = email;
    user.profilePicture = profile.photos?.[0]?.value || "";
    user.role = adminEmails.includes(email) ? "admin" : "customer";
    user.lastLogin = new Date();

    return await user.save();
};

/**
 * Handle Google login.
 * - Returns an existing user if found.
 * - Links an existing account by email if needed.
 * - Creates a new account otherwise.
 */
const handleGoogleLogin = async (profile) => {
    // First check Google ID
    let user = await findUserByGoogleId(profile.id);

    if (user) {
        return await updateGoogleUser(user, profile);
    }

    // Check if an account already exists with the same email
    user = await findUserByEmail(profile.emails[0].value);

    if (user) {
        user.googleId = profile.id;

        return await updateGoogleUser(user, profile);
    }

    // Create a brand-new account
    return await createGoogleUser(profile);
};

module.exports = {
    handleGoogleLogin,
    findUserByGoogleId,
    findUserByEmail,
    createGoogleUser,
    updateGoogleUser,
};