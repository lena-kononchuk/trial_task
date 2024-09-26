// Function to load HTML components dynamically
function loadHTML(id, url) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // Convert the response to text
        })
        .then((data) => {
            // Insert the fetched HTML into the element with the specified ID
            const targetElement = document.getElementById(id);
            if (targetElement) {
                targetElement.innerHTML = data;

                // Check if the loaded content is the form, and initialize validation if so
                if (id === 'form') {
                    // Ensure the initializeFormValidation function is defined
                    if (typeof initializeFormValidation === 'function') {
                        initializeFormValidation(); // Call the function to initialize form validation
                    } else {
                        console.error('initializeFormValidation is not defined.');
                    }
                }

                // Check if the loaded content is the swiper, and initialize it if so
                if (id === 'swiper' && typeof initializeSwiper === 'function') {
                    initializeSwiper(); // Call the function to initialize Swiper
                }

                // Check if the loaded content is the header (navigation), and initialize the mobile menu
                if (id === 'header' && typeof initializeMobileMenuAndScroll === 'function') {
                    initializeMobileMenuAndScroll(); // Call the function to initialize mobile menu and scroll behavior
                }

                // Check if the loaded content is the article, and initialize related sliders
                if (id === 'article') {
                    if (typeof initializeSumSlider === 'function') {
                        initializeSumSlider();
                    }
                    if (typeof initializeMonthsSlider === 'function') {
                        initializeMonthsSlider();
                    }
                }
            } else {
                console.error(`Element with id ${id} not found.`);
            }
        })
        .catch((error) => {
            console.error(`Error loading ${url}:`, error);
        });
}



// Function to initialize mobile menu and smooth scroll behavior
function initializeMobileMenuAndScroll() {
    const menu = document.getElementById('mobileMenu'); // Get the mobile menu element
    const menuIcon = document.querySelector('.menu-icon'); // Get the menu icon element

    // Function to toggle the mobile menu visibility
    function toggleMobileMenu() {
        menu.classList.toggle('is-open');
        menuIcon.classList.toggle('open');
    }

    // Function to close the menu and scroll to section
    function closeMenuAndScrollToSection(event) {
        const targetSection = document.querySelector(event.target.getAttribute('href')); // Get the target section

        if (targetSection) {
            event.preventDefault(); // Prevent default link behavior (jumping to section)
            menu.classList.remove('is-open');
            menuIcon.classList.remove('open');
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Attach event listeners to all anchor links inside the mobile menu
    document.querySelectorAll('#mobileMenu a[href^="#"]').forEach(link => {
        link.addEventListener('click', closeMenuAndScrollToSection);
    });

    // Attach event listener to menu icon for opening/closing
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMobileMenu);
    }
}

// Initialize Swiper function (already provided)
function initializeSwiper() {
    const swiper = new Swiper('.swiper__reviews', {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 1 },
            1024: { slidesPerView: 1 }
        }
    });

    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');

    const updateNavigationButtons = () => {
        if (swiper.slides.length === 0) {
            nextButton.classList.add('disabled');
            prevButton.classList.add('disabled');
            return;
        }
        prevButton.classList.toggle('disabled', swiper.isBeginning);
        nextButton.classList.toggle('disabled', swiper.isEnd || swiper.activeIndex === swiper.slides.length - 2);
    };

    if (nextButton && prevButton) {
        nextButton.addEventListener('click', () => swiper.slideNext());
        prevButton.addEventListener('click', () => swiper.slidePrev());
        swiper.on('slideChange', updateNavigationButtons);
        updateNavigationButtons();
    }
}
// copy logo
var copy = document.querySelector(".logo_items").cloneNode(true);
    document.querySelector(".logos").appendChild(copy);

// Load HTML components dynamically by calling the loadHTML function for each section
loadHTML('header', 'section/header.html');
loadHTML('form', 'section/form.html');
loadHTML('article', 'section/article.html');
loadHTML('swiper', 'section/swiper.html'); // Ensure Swiper is loaded and initialized
loadHTML('footer', 'section/footer.html');
