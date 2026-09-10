const House = require("../models/House");

// ==========================================
// PUBLIC — Get Houses
// ==========================================

const getHouses = async ({
    page = 1,
    limit = 20,
    search = "",
    houseType = "",
    area = "",
    minRent,
    maxRent,
    availabilityStatus = "",
    sort = "latest",
}) => {

    page = Number(page);
    limit = Number(limit);

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 20;
    }

    if (limit > 50) {
        limit = 50;
    }

    const skip = (page - 1) * limit;

    // ==========================================
    // Base filter
    // ==========================================

    const filter = {
        isActive: true,
    };

    // ==========================================
    // Search
    // ==========================================

    if (search) {

        filter.$or = [

            {
                title: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                description: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                area: {
                    $regex: search,
                    $options: "i",
                },
            },

            {
                landmark: {
                    $regex: search,
                    $options: "i",
                },
            },

        ];

    }

    // ==========================================
    // House Type
    // ==========================================

    if (houseType) {

        filter.houseType = houseType;

    }

    // ==========================================
    // Area
    // ==========================================

    if (area) {

        filter.area = {
            $regex: area,
            $options: "i",
        };

    }

    // ==========================================
    // Rent Filter
    // ==========================================

    if (
        minRent !== undefined ||
        maxRent !== undefined
    ) {

        filter.rent = {};

        if (minRent !== undefined) {

            filter.rent.$gte = Number(minRent);

        }

        if (maxRent !== undefined) {

            filter.rent.$lte = Number(maxRent);

        }

        if (
            minRent !== undefined &&
            Number.isNaN(filter.rent.$gte)
        ) {

            throw new Error("Invalid minimum rent.");

        }

        if (
            maxRent !== undefined &&
            Number.isNaN(filter.rent.$lte)
        ) {

            throw new Error("Invalid maximum rent.");

        }

        if (
            filter.rent.$gte !== undefined &&
            filter.rent.$lte !== undefined &&
            filter.rent.$gte > filter.rent.$lte
        ) {

            throw new Error(
                "Minimum rent cannot be greater than maximum rent."
            );

        }

    }

    // ==========================================
    // Availability
    // ==========================================

    if (availabilityStatus) {

        const allowedStatuses = [
            "Available",
            "Occupied",
            "Unknown",
        ];

        if (
            !allowedStatuses.includes(
                availabilityStatus
            )
        ) {

            throw new Error(
                "Invalid availability status."
            );

        }

        filter.availabilityStatus =
            availabilityStatus;

    }

    // ==========================================
    // Sorting
    // ==========================================

    let sortOption = {
        createdAt: -1,
    };

    switch (sort) {

        case "rentLow":

            sortOption = {
                rent: 1,
            };

            break;

        case "rentHigh":

            sortOption = {
                rent: -1,
            };

            break;

        case "oldest":

            sortOption = {
                createdAt: 1,
            };

            break;

        case "latest":

        default:

            sortOption = {
                createdAt: -1,
            };

            break;

    }

    // ==========================================
    // Get Houses + Count
    // ==========================================

    const [
        houses,
        total,
    ] = await Promise.all([

        House.find(filter)
            .select(
                "houseCode title houseType description rent deposit area landmark distanceFromCampus bathroomType waterAvailability electricityType securityFeatures parkingAvailable images availabilityStatus isVerified lastVerifiedAt createdAt"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(limit),

        House.countDocuments(filter),

    ]);

    // ==========================================
    // Return
    // ==========================================

    return {

        houses,

        pagination: {

            page,

            limit,

            total,

            totalPages: Math.ceil(
                total / limit
            ),

        },

    };

};


const getHouseById = async (houseId) => {

    const house = await House.findOne({

        _id: houseId,

        isActive: true,

    }).select(
        "houseCode title houseType description rent deposit area landmark distanceFromCampus bathroomType waterAvailability electricityType securityFeatures parkingAvailable images availabilityStatus isVerified lastVerifiedAt createdAt"
    );

    if (!house) {

        throw new Error("House not found.");

    }

    return house;
};


module.exports = {
    getHouses,
    getHouseById
};