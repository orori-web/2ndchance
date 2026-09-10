const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Category = require("../models/Category");

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const categories = [
    {
        name: "Electronics",
        slug: "electronics",
        order: 1,
        image: "/images/categories/electronics.jpeg",
    },
    {
        name: "Phones",
        slug: "phones",
        order: 2,
        image: "/images/categories/phone.jpeg",
    },
    {
        name: "Laptops",
        slug: "laptops",
        order: 3,
        image: "/images/categories/laptops.jpeg",
    },
    {
        name: "TV",
        slug: "tv",
        order: 4,
        image: "/images/categories/tv.jpeg",
    },
    {
        name: "Furniture",
        slug: "furniture",
        order: 5,
        image: "/images/categories/furniture.jpeg",
    },
    {
        name: "Fashion",
        slug: "fashion",
        order: 6,
        image: "/images/categories/fashion.jpeg",
    },
    {
        name: "Home Decor",
        slug: "home-decor",
        order: 7,
        image: "/images/categories/home decor.jpeg",
    },
    {
        name: "Kitchen Appliances",
        slug: "kitchen-appliances",
        order: 8,
        image: "/images/categories/kitchen appliances.jpeg",
    },
    {
        name: "Musical Instruments",
        slug: "musical-instruments",
        order: 9,
        image: "/images/categories/musical instruments.jpeg",
    },
    {
        name: "Bikes",
        slug: "bikes",
        order: 10,
        image: "/images/categories/bikes.jpeg",
    },
    {
        name: "Others",
        slug: "others",
        order: 11,
        image: "/images/categories/others.jpeg",
    },
];

const seedCategories = async () => {
    try {
        await Category.deleteMany();

        await Category.insertMany(categories);

        console.log("✅ Categories Seeded Successfully");

        process.exit();
    } catch (error) {
        console.error(error);

        process.exit(1);
    }
};

seedCategories();