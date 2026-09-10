const API_BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

// ------------------------------------------
// Central API request function
// ------------------------------------------

const apiFetch = async (endpoint, options = {}) => {

    const token = localStorage.getItem("token");

    const headers = {
        ...(options.headers || {}),
    };


    // Add JSON content type when a body is present
    // and the caller hasn't already specified one.

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers["Content-Type"]
    ) {

        headers["Content-Type"] = "application/json";

    }


    // Attach JWT when available

    if (token) {

        headers.Authorization = `Bearer ${token}`;

    }


    const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
        ...options,
        credentials: "include",
        headers,
    }
);


    // Try to read the response as JSON

    let data = null;

    try {

        data = await response.json();

    } catch (error) {

        data = null;

    }


    // Handle HTTP errors centrally

    if (!response.ok) {

        const error = new Error(
            data?.message ||
            "Something went wrong with the request."
        );

        error.status = response.status;
        error.data = data;

        throw error;

    }


    return data;

};


// ------------------------------------------
// Public API
// ------------------------------------------

export {
    API_BASE_URL,
    apiFetch,
};