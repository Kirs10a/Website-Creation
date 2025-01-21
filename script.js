document.addEventListener("DOMContentLoaded", function () {
    // Phone Number Formatting (intl-tel-input)
    const phoneInput = document.getElementById("phone");
    const emailInput = document.getElementById("email");
    // Email to post
    const form = document.getElementById("questionnaireForm");
    const submitButton = document.querySelector("button[type='submit']"); // Your submit button
    const successMessage = document.createElement("p"); // Success message container
    emailjs.init("service_wws412t");
  
    // Style the success message
    successMessage.style.display = "none"; // Initially hide it
    successMessage.style.color = "green"; // Make it green
    successMessage.style.fontSize = "16px";
    successMessage.style.fontWeight = "bold";
    successMessage.textContent = "Your form was successfully submitted!";
    document.querySelector(".container").appendChild(successMessage);

    // International phone number 
    const iti = window.intlTelInput(phoneInput, {
        preferredCountries: ["za", "us", "gb"],
        initialCountry: "auto",
        geoIpLookup: function (callback) {
            fetch("https://ipinfo.io/json")
                .then((res) => res.json())
                .then((data) => callback(data.country))
                .catch(() => callback("us"));
        },
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js" // Add utils for formatting
    });

    // Phone number validation on blur
    phoneInput.addEventListener("blur", () => {
        if (!iti.isValidNumber()) {
            alert("Please enter a valid phone number.");
            phoneInput.classList.add("invalid");
        } else {
            phoneInput.classList.remove("invalid");
        }
    });

    // Email validation on input
    const emailError = document.getElementById("emailError");
    emailInput.addEventListener("input", () => {
        if (emailInput.validity.typeMismatch || emailInput.value === "") {
            emailInput.classList.add("invalid");
            emailError.textContent = "Please enter a valid email address.";
        } else {
            emailInput.classList.remove("invalid");
            emailError.textContent = "";
        }
    });

    // Form submission handling
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check if email is valid
        if (emailInput.validity.typeMismatch || emailInput.value === "") {
            emailError.textContent = "Please enter a valid email address.";
            emailInput.focus();
            return; // Prevent form submission if email is invalid
        }

        // Make sure phone number is valid
        if (!iti.isValidNumber()) {
            alert("Please enter a valid phone number.");
            phoneInput.focus();
            return; // Prevent form submission if phone number is invalid
        }

        // Ensure reCAPTCHA is verified (Optional but recommended)
        const recaptchaResponse = grecaptcha.getResponse(); // Get reCAPTCHA response
        if (!recaptchaResponse) {
            alert("Please verify that you are not a robot.");
            return; // Prevent form submission if reCAPTCHA not verified
        }

        // Change submit button text and color on success
        submitButton.textContent = "Success"; // Set button text to "Success"
        submitButton.style.background = "linear-gradient(45deg, #4caf50, #81c784)"; // Green gradient for success
        submitButton.style.color = "white"; // Ensure text is white
        submitButton.style.border = "none"; // Optional: remove the border if any

        // Show a success message
        successMessage.style.display = "block"; // Make the success message visible

        // Proceed with form submission via EmailJS
        sendFormData(); // Assume this function is defined elsewhere for form submission
    });

    function sendFormData() {
        const formData = new FormData(form);
    
        // Send email to the owner
        emailjs.sendForm('service_wws412t', 'template_38gdl8b', '#questionnaireForm', 'y7iBeg1e0KKK0zwYJ')
            .then(function (response) {
                console.log("Email to owner sent successfully!", response);
            }, function (error) {
                console.error("Error sending email to owner:", error);
            });
    
        // Send email to the user
        emailjs.sendForm('service_wws412t', 'template_rg2ueqq', '#questionnaireForm', 'y7iBeg1e0KKK0zwYJ')
            .then(function (response) {
                console.log("Confirmation email sent to user successfully!", response);
            }, function (error) {
                console.error("Error sending email to user:", error);
            });
    }

    // Logo options toggling (upload or draw)
    window.toggleLogoOptions = function () {
        const logoOption = document.getElementById("logo").value;
        const uploadSection = document.getElementById("logoUploadSection");
        const canvasSection = document.getElementById("logoCanvasSection");

        if (logoOption === "upload") {
            uploadSection.style.display = "block";
            canvasSection.style.display = "none";
        } else if (logoOption === "draw") {
            uploadSection.style.display = "none";
            canvasSection.style.display = "block";
        } else {
            uploadSection.style.display = "none";
            canvasSection.style.display = "none";
        }
    };

    window.clearCanvas = function () {
        const canvas = document.getElementById("logoCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Canvas drawing functionality
    const canvas = document.getElementById("logoCanvas");
    const ctx = canvas.getContext("2d");
    let isDrawing = false;

    canvas.addEventListener("mousedown", (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDrawing) {
            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.strokeStyle = "black"; // Line color
            ctx.lineWidth = 2; // Line width
            ctx.stroke();
        }
    });

    canvas.addEventListener("mouseup", () => {
        isDrawing = false;
        ctx.closePath();
    });

    canvas.addEventListener("mouseout", () => {
        isDrawing = false;
    });

    // Color pickers and buttons
    const backgroundColorPicker = document.getElementById("backgroundColor");
    const textColorPicker = document.getElementById("textColor");
    const buttonColorPicker = document.getElementById("buttonColor");
    const tryColorsButton = document.getElementById("tryColorsButton");
    const resetButton = document.getElementById("resetButton");

    // Default color values for light and dark modes
    const lightModeBackgroundColor = "#ffffff"; // Light mode background color
    const lightModeTextColor = "#000000"; // Light mode text color
    const lightModeButtonColor = "#007bff"; // Light mode button color

    const darkModeBackgroundColor = "#393939"; // Dark mode background color
    const darkModeTextColor = "#dcdcdc"; // Dark mode text color
    const darkModeButtonColor = "#ff5500"; // Dark mode button color

    // Initialize colors to dark mode defaults by default
    let isLightMode = false;
    updateColors(darkModeBackgroundColor, darkModeTextColor, darkModeButtonColor);

    // Light/Dark mode toggle functionality
    const toggleBtn = document.getElementById("toggleBtn");
    const body = document.body;

    toggleBtn.addEventListener("click", () => {
        isLightMode = !isLightMode; // Toggle mode
        if (isLightMode) {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            toggleBtn.textContent = "Switch to Dark Mode";
            updateColors(lightModeBackgroundColor, lightModeTextColor, lightModeButtonColor);
        } else {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            toggleBtn.textContent = "Switch to Light Mode";
            updateColors(darkModeBackgroundColor, darkModeTextColor, darkModeButtonColor);
        }
    });

    // Event listener to apply colors when user clicks "Try Colors"
    tryColorsButton.addEventListener("click", updateColorsFromPicker);

    // Event listener for background, text, and button color pickers
    backgroundColorPicker.addEventListener("input", updateColorsFromPicker);
    textColorPicker.addEventListener("input", updateColorsFromPicker);
    buttonColorPicker.addEventListener("input", updateColorsFromPicker);

    // Event listener for the reset button to restore default colors
    resetButton.addEventListener("click", resetColors);

    // Function to update the colors based on the current mode or user input
    function updateColors(background, text, button) {
        document.body.style.backgroundColor = background;
        document.body.style.color = text;

        // Update the buttons' background color
        const buttons = document.querySelectorAll("button");
        buttons.forEach((buttonElement) => {
            buttonElement.style.backgroundColor = button;
        });

        // Apply changes to the container's background and box-shadow
        const container = document.querySelector(".container");
        container.style.backgroundColor = background;
        container.style.color = text; // Update text color in container
        container.style.boxShadow = `0 4px 8px rgba(${parseInt(button.slice(1, 3), 16)}, ${parseInt(button.slice(3, 5), 16)}, ${parseInt(button.slice(5, 7), 16)}, 0.935)`;

        // Update heading colors
        const headings = document.querySelectorAll("h1, h2");
        headings.forEach((heading) => {
            heading.style.color = text;
        });
    }

    // Function to update colors from the color pickers
    function updateColorsFromPicker() {
        const background = backgroundColorPicker.value;
        const text = textColorPicker.value;
        const button = buttonColorPicker.value;

        updateColors(background, text, button);
    }

    // Function to reset the colors to default (based on the current mode)
    function resetColors() {
        if (isLightMode) {
            updateColors(lightModeBackgroundColor, lightModeTextColor, lightModeButtonColor);
        } else {
            updateColors(darkModeBackgroundColor, darkModeTextColor, darkModeButtonColor);
        }
    }
    


});
