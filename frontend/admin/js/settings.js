import { apiFetch } from "./api.js";

console.log("Admin settings page running");

// ==========================================
// DOM ELEMENTS
// ==========================================

const settingsForm =
    document.getElementById(
        "settings-form"
    );

const settingsMessage =
    document.getElementById(
        "settings-message"
    );

const businessNameInput =
    document.getElementById(
        "business-name"
    );

const whatsappNumberInput =
    document.getElementById(
        "whatsapp-number"
    );

const supportEmailInput =
    document.getElementById(
        "support-email"
    );

const supportPhoneInput =
    document.getElementById(
        "support-phone"
    );

const saveSettingsButton =
    document.getElementById(
        "save-settings-button"
    );


// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    message,
    isError = false
) => {

    settingsMessage.textContent =
        message;

    settingsMessage.style.color =
        isError
            ? "red"
            : "green";

};


// ==========================================
// LOAD SETTINGS
// ==========================================

const loadSettings = async () => {

    try {

        showMessage(
            "Loading settings..."
        );

        const data =
            await apiFetch(
                "/api/settings"
            );

        console.log(
            "Settings response:",
            data
        );

        const settings =
            data.settings;

        if (!settings) {

            throw new Error(
                "Settings not found."
            );

        }


        // ==================================
        // FILL FORM
        // ==================================

        businessNameInput.value =
            settings.businessName || "";


        whatsappNumberInput.value =
            settings.whatsAppNumber || "";


        supportEmailInput.value =
            settings.supportEmail || "";


        supportPhoneInput.value =
            settings.supportPhone || "";


        showMessage(
            "Settings loaded."
        );

    } catch (error) {

        console.error(
            "Failed to load settings:",
            error
        );

        if (error.status === 401) {

            window.location.href =
                "login.html";

            return;

        }

        if (error.status === 403) {

            showMessage(
                "You are not authorized to manage business settings.",
                true
            );

            return;

        }

        showMessage(
            error.message ||
            "Failed to load settings.",
            true
        );

    }

};


// ==========================================
// SAVE SETTINGS
// ==========================================

const saveSettings = async (
    event
) => {

    event.preventDefault();

    try {

        saveSettingsButton.disabled =
            true;

        saveSettingsButton.textContent =
            "Saving...";


        showMessage(
            "Saving settings..."
        );


        const payload = {

            businessName:
                businessNameInput.value.trim(),

            whatsAppNumber:
                whatsappNumberInput.value.trim(),

            supportEmail:
                supportEmailInput.value.trim(),

            supportPhone:
                supportPhoneInput.value.trim(),

        };


        console.log(
            "Updating settings:",
            payload
        );


        const data =
            await apiFetch(
                "/api/settings",
                {
                    method: "PUT",

                    body:
                        JSON.stringify(
                            payload
                        ),
                }
            );


        console.log(
            "Updated settings:",
            data
        );


        const settings =
            data.settings;


        if (settings) {

            businessNameInput.value =
                settings.businessName || "";

            whatsappNumberInput.value =
                settings.whatsAppNumber || "";

            supportEmailInput.value =
                settings.supportEmail || "";

            supportPhoneInput.value =
                settings.supportPhone || "";

        }


        showMessage(
            "Business settings updated successfully."
        );

    } catch (error) {

        console.error(
            "Failed to update settings:",
            error
        );

        showMessage(
            error.message ||
            "Failed to update settings.",
            true
        );

    } finally {

        saveSettingsButton.disabled =
            false;

        saveSettingsButton.textContent =
            "Save Settings";

    }

};


// ==========================================
// EVENTS
// ==========================================

settingsForm.addEventListener(
    "submit",
    saveSettings
);


// ==========================================
// INITIALIZE
// ==========================================

loadSettings();