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
    }

    setupDropdownPositioning() {
        // Listen for dropdown open event
        this.inputElement.addEventListener('open:dropdown', () => {
            this.repositionDropdown();
        });

        // Reposition dropdown on resize or scroll
        window.addEventListener('resize', () => this.repositionDropdown());
        window.addEventListener('scroll', () => this.repositionDropdown());
    }

repositionDropdown() {
    const dropdown = document.querySelector('.iti__dropdown');
    const dropdownContainer = document.querySelector('.dropdown'); 
    if (!dropdown || !dropdownContainer) return;

    const rect = dropdownContainer.getBoundingClientRect(); 
    const dropdownHeight = dropdown.offsetHeight;

    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.width = `${rect.width}px`; 
    dropdown.style.position = 'absolute'; 
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
    
    // Initially hide error message (opacity = 0)
    errorMessage.classList.remove('visible');

    document.querySelectorAll('input').forEach(input => {
        input.classList.remove('valid', 'invalid');
        input.closest('.form__group').classList.add('empty');

        input.addEventListener('focus', () => {
            input.closest('.form__group').classList.remove('empty');
            errorMessage.classList.remove('visible'); // Hide error message on focus
        });

        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                input.closest('.form__group').classList.remove('empty');

                // Validate phone number through intl-tel-input
                if (input.classList.contains('iti__tel-input')) {
                    const phoneNumberElement = input;
                    const isValidPhone = phoneNumberElement.checkValidity();

                    if (isValidPhone) {
                        phoneNumberElement.classList.remove('invalid');
                        phoneNumberElement.classList.add('valid');
                        errorMessage.classList.remove('visible'); // Hide error message
                    } else {
                        phoneNumberElement.classList.remove('valid');
                        phoneNumberElement.classList.add('invalid');
                        errorMessage.innerText = "Please fill out all fields correctly.";
                        errorMessage.classList.add('visible'); // Show error message
                    }
                } else {
                    // Validate other fields (e.g., name and email)
                    if (input.checkValidity()) {
                        input.classList.remove('invalid');
                        input.classList.add('valid');
                        errorMessage.classList.remove('visible'); // Hide error message
                    } else {
                        input.classList.remove('valid');
                        input.classList.add('invalid');
                        errorMessage.innerText = "Please fill out all fields correctly.";
                        errorMessage.classList.add('visible'); // Show error message
                    }
                }
            } else {
                input.closest('.form__group').classList.add('empty');
                input.classList.remove('valid', 'invalid');
                errorMessage.classList.remove('visible'); // Hide error message
            }
        });
    });
}
