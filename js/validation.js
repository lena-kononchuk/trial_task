class IntlTelInputElement extends HTMLElement {
    constructor() {
        super();
        this.inputElement = document.createElement('input');
        this.inputElement.type = 'tel';
        this.inputElement.setAttribute('minlength', '5');
        this.inputElement.classList.add('iti__tel-input');

        this.appendChild(this.inputElement);
        this.intlTelInputInstance = null; // Store intlTelInput instance
    }
connectedCallback() {
    // Initialize intlTelInput
    this.intlTelInputInstance = intlTelInput(this.inputElement, {
        autoHideDialCode: false,
        autoPlaceholder: 'ON',
        formatOnDisplay: true,
        nationalMode: true,
        preferredCountries: ['uk', 'ie', 'gb', 'in'],
        initialCountry: "auto",
        geoIpLookup: (callback) => {
            fetch('https://ipinfo.io?token=4fbab07461a9f4')
                .then(response => response.json())
                .then(data => {
                    const countryCode = (data && data.country) ? data.country : "ie";
                    callback(countryCode);
                })
                .catch(() => {
                    callback("ie"); // Default to Ireland if lookup fails
                });
        },
        separateDialCode: true,
        placeholderNumberType: 'MOBILE',
        dropdownContainer: document.querySelector('.dropdown'), // Use the specific span container
        utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@24.5.0/build/js/utils.js',
    });

    // Ensure dropdown is repositioned correctly when opened
    this.setupDropdownPositioning();

    // Add event listener to restrict input to numbers only
    this.inputElement.addEventListener('keydown', (event) => {
        if (!this.isAllowedKey(event)) {
            event.preventDefault(); // Prevent non-numeric keys
        }
    });
}


    setupDropdownPositioning() {
        this.inputElement.addEventListener('open:dropdown', () => {
            this.repositionDropdown();
        });

        window.addEventListener('resize', () => this.repositionDropdown());
        window.addEventListener('scroll', () => this.repositionDropdown());
    }

repositionDropdown() {
    const dropdown = document.querySelector('.iti__dropdown'); // Country dropdown list
    const dropdownContainer = document.querySelector('.dropdown'); // Container for the dropdown list
    if (!dropdown || !dropdownContainer) return;

    // Get the coordinates of the container relative to the browser window
    const rect = dropdownContainer.getBoundingClientRect();

    // Position the dropdown list
    dropdown.style.position = 'absolute'; // Set the position to absolute
    dropdown.style.left = `${rect.left + window.scrollX}px`; // Positioning aligned to the left edge of the container
    dropdown.style.width = `${rect.width}px`; // Width matches the width of the container
    
    // Set the position of the dropdown list below the container
    dropdown.style.top = `${rect.bottom + window.scrollY}px`; // Positioning below the container
}



    get value() {
        return this.inputElement.value;
    }

    checkValidity() {
        const isValidNumber = this.intlTelInputInstance.isValidNumber();

        if (isValidNumber) {
            this.inputElement.classList.remove('invalid');
            this.inputElement.classList.add('valid');
        } else {
            this.inputElement.classList.add('invalid');
            this.inputElement.classList.remove('valid');
        }
    }

    isAllowedKey(event) {
        const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete']; // Allowed keys
        const isNumber = (event.key >= '0' && event.key <= '9'); // Check if pressed key is a digit
        return allowedKeys.includes(event.key) || isNumber; // Return true if key is allowed
    }
}

// Define custom element
customElements.define('intl-tel-input', IntlTelInputElement);

// Function to initialize form validation
function initializeFormValidation() {
    const errorMessage = document.getElementById("error-message");
    const form = document.getElementById("registrationForm"); // The form element

    // Initially hide the error message
    errorMessage.classList.remove('visible');

    // Set initial classes and add event listeners to all input fields
    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid'); // Remove validation classes
        input.closest('.form__group').classList.add('empty'); // Mark fields as empty

        // Focus event handler for each input field
        input.addEventListener('focus', () => {
            input.closest('.form__group').classList.remove('empty'); // Remove "empty" class on focus
            errorMessage.classList.remove('visible'); // Hide error message on focus
        });

        // Input event handler for each input field
        input.addEventListener('input', () => handleInputValidation(input, errorMessage));
    });

    // Form submission event handler
    form.addEventListener('submit', (event) => handleSubmit(event, form, errorMessage));
}

// Function to handle input validation for each field
function handleInputValidation(input, errorMessage) {
    if (input.value.trim() !== '') {
        input.closest('.form__group').classList.remove('empty'); // Remove "empty" class when field is filled

        // Validate the phone number
        if (input.classList.contains('iti__tel-input')) {
            validatePhoneNumber(input, errorMessage);
        } else {
            // Validate other fields (e.g., name and email)
            validateField(input, errorMessage);
        }
    } else {
        // If field is empty, reset classes and mark as empty
        input.closest('.form__group').classList.add('empty');
        input.classList.remove('valid', 'invalid');
        errorMessage.classList.remove('visible');
    }
}

// Function to validate phone number fields
function validatePhoneNumber(phoneNumberElement, errorMessage) {
    const isValidPhone = phoneNumberElement.checkValidity(); // Check phone number validity

    if (isValidPhone) {
        phoneNumberElement.classList.remove('invalid');
        phoneNumberElement.classList.add('valid');
        errorMessage.classList.remove('visible'); // Hide error message if phone number is valid
    } else {
        phoneNumberElement.classList.remove('valid');
        phoneNumberElement.classList.add('invalid');
        showErrorMessage(errorMessage, "Please fill out all fields correctly."); // Show error message
    }
}

// Function to validate other fields (e.g., name and email)
function validateField(input, errorMessage) {
    if (input.checkValidity()) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        errorMessage.classList.remove('visible'); // Hide error message
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        showErrorMessage(errorMessage, "Please fill out all fields correctly."); // Show error message
    }
}

// Function to handle form submission
function handleSubmit(event, form, errorMessage) {
    event.preventDefault(); // Prevent default form submission behavior

    let allValid = true; // Flag to track if all fields are valid

    // Validate all input fields in the form
    document.querySelectorAll('input').forEach(input => {
        if (!input.checkValidity() || input.classList.contains('invalid')) {
            allValid = false; // Set flag to false if any field is invalid
        }
    });

    // If all fields are valid, show an alert and reset the form after clicking "OK"
    if (allValid) {
        alert('Form submitted successfully!'); // Show success message
        form.reset(); // Reset the form fields

        // Remove validation classes and mark fields as empty
        document.querySelectorAll('input').forEach(input => {
            input.classList.remove('valid', 'invalid');
            input.closest('.form__group').classList.add('empty');
        });

        errorMessage.classList.remove('visible'); // Hide error message
    }
}

// Function to display error message
function showErrorMessage(errorMessage, message) {
    errorMessage.innerText = message; // Set error message text
    errorMessage.classList.add('visible'); // Show error message
}

// Initialize form validation on page load
initializeFormValidation();

