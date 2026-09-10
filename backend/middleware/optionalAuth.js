const optionalAuth = async (req, res, next) => {
    try {

        let token;

        // ------------------------------------------
        // 1. Check Authorization header
        // ------------------------------------------

        const authHeader =
            req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {

            token =
                authHeader.split(" ")[1];

        }


        // ------------------------------------------
        // 2. Check authentication cookie
        // ------------------------------------------

        if (
            !token &&
            req.cookies?.authToken
        ) {

            token =
                req.cookies.authToken;

        }


        // ------------------------------------------
        // 3. No authentication
        // ------------------------------------------

        if (!token) {

            req.user = null;

            return next();

        }


        // ------------------------------------------
        // 4. Verify JWT
        // ------------------------------------------

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ------------------------------------------
        // 5. Find user
        // ------------------------------------------

        const user =
            await User.findById(
                decoded.id
            ).select("-__v");


        if (
            !user ||
            !user.isActive
        ) {

            req.user = null;

            return next();

        }


        // ------------------------------------------
        // 6. Attach user
        // ------------------------------------------

        req.user = user;

        next();

    } catch (error) {

        // Invalid/expired token
        // → Continue as guest

        req.user = null;

        next();

    }
};

module.exports =
    optionalAuth;