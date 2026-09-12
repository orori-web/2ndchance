const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");


require("./config/passport");



const authRoutes = require("./routes/authRoutes");

const categoryRoutes = require("./routes/categoryRoutes");

const productRoutes = require("./routes/productRoutes");

const userRoutes = require("./routes/userRoutes");

const homeRoutes = require("./routes/homeRoutes");

const adminRoutes = require("./routes/adminRoutes");

const cartRoutes = require("./routes/cartRoutes");

const settingsRoutes = require("./routes/settingsRoutes");

const houseRoutes = require("./routes/houseRoutes");

const posterRoutes = require("./routes/posterRoutes");

const path = require("path");



const app = express();

app.use(express.static(path.join(__dirname, "../frontend")));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/settings", settingsRoutes);
app.use(
    "/api/houses",
    houseRoutes
);
app.use(
    "/api/posters",
    posterRoutes
);




app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/home.html")
    );
});

module.exports = app;