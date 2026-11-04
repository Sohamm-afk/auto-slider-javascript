
const objectArray = [
    { name: 'Headphone', 
    image: 'images/headphone.jpg', originalPrice: '2000',
         price: '1299' },
    { name: 'shoes',
         image:'images/shoes2.webp', originalPrice: '1999',
          price: '1399' },
    { name: 'Necklace', image:'images/necklaace.webp', originalPrice: '50000', price: '28999' },
    { name: 'badminton', image: 'images/badminton.webp',
         originalPrice: '1599', price: '899' },
    { name: 'water bottle', image: 'images/water bottle.webp',
         originalPrice: '600', price: '499' },
    { name: 'cushions', 
        image: 'images/cushions.webp', originalPrice: '799', 
        price: '599' },
    { name: 'keyboard', 
        image: 'images/keyboard.webp', originalPrice: '5000',
         price: '3999' },
    { name: 'television', image: 'images/television.webp', originalPrice: '80000', price: '71000' }
];

// as requirement stored products in javascript arrayof objects.
const slider = document.getElementById('slider');

slider.innerHTML = objectArray.map(function (item) {
    // this function calculated the discount percentage whihc is written over the each object
    const discount = Math.round(
        ((Number(item.originalPrice) - Number(item.price)) / Number(item.originalPrice)) * 100
    );

    return `
        <div class="thumbnail">
            <button class="wishlist-toggle" type="button" aria-pressed="false"
                    aria-label="Add ${item.name} to wishlist">♥</button>
            <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async">
            <div class="product-details">
                <h2>${item.name}</h2>
                <p><span>${item.originalPrice}</span> ${item.price}</p>
                <div class="discount-badge">${discount}% OFF</div>
                <button class="add-to-cart" type="button">Add to Cart</button>
            </div>
        </div>
    `;
}).join('');

// thsi function i created as cards to ge to know the width of the cards and gap in between them.
const cards = document.getElementsByClassName('thumbnail');

function getScrollStep() {
    return cards[0].getBoundingClientRect().width + 10;
}

const nextBtn = document.getElementById('slide-right');
const prevBtn = document.getElementById('slide-left');

// this is to move the slider left or right whenever user clicks left or right arrow in there
prevBtn.addEventListener('click', function () {
    slider.scrollLeft -= getScrollStep();
    restartAutoplayTimer();
});

nextBtn.addEventListener('click', function () {
    slider.scrollLeft += getScrollStep();
    restartAutoplayTimer();
});

// this to move slider left or right
slider.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        slider.scrollBy({
            left: getScrollStep(),
            behavior: 'smooth'
        });

        event.preventDefault();
        restartAutoplayTimer();
    } else if (event.key === 'ArrowLeft') {
        slider.scrollBy({
            left: -getScrollStep(),
            behavior: 'smooth'
        });

        event.preventDefault();
        restartAutoplayTimer();
    }
});

// the slider moves automatically after every 3 seconds 
function moveToNextCard() {
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    // this is for when there are no cards so it will return and keep slider not moving
    if (maxScrollLeft <= 0 || cards.length === 0) {
        return;
    }

    // thsi si responsible for moving slider to back to the startwhen it reaches the end
    if (slider.scrollLeft >= maxScrollLeft - 1) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        // thsi is to move sliderto next card
        const cardStep = cards[0].offsetWidth + 10;
        slider.scrollBy({ left: cardStep, behavior: 'smooth' });
    }
}

const autoplayButton = document.getElementById('autoplay-toggle');
const progressBar = document.querySelector('.autoplay-progress');
const progressFill = document.getElementById('autoplay-progress-fill');
const cartMessage = document.getElementById('cart-toast');

const autoplayDelay = 3000;
let timer = null;
let timeRemaining = autoplayDelay;
let timerStartTime = null;
let cartMessageTimer = null;

// this function for the progress bar
function startAutoplay() {
    if (timer === null) {
        progressFill.style.transition = 'none';
        progressFill.style.width = `${((autoplayDelay - timeRemaining) / autoplayDelay) * 100}%`;

        void progressFill.offsetWidth;

        progressFill.style.transition = `width ${timeRemaining}ms linear`;
        progressFill.style.width = '100%';

        progressBar.setAttribute('aria-valuenow', String(autoplayDelay - timeRemaining));

        timerStartTime = Date.now();

        timer = setTimeout(function () {
            timer = null;
            timeRemaining = autoplayDelay;

            progressFill.style.transition = 'none';
            progressFill.style.width = '0%';
            progressBar.setAttribute('aria-valuenow', '0');

            moveToNextCard();
            startAutoplay();
        }, timeRemaining);

        autoplayButton.textContent = 'Pause';
        autoplayButton.setAttribute('aria-label', 'Pause automatic sliding');
    }
}

// this function is for pausing the autoplay when user clicks the pause button at the bootm.
function pauseAutoplay() {
    if (timer !== null) {
        clearTimeout(timer);

        timeRemaining = Math.max(
            0,
            timeRemaining - (Date.now() - timerStartTime)
        );

        timer = null;
        timerStartTime = null;

        progressFill.style.transition = 'none';
        progressFill.style.width = getComputedStyle(progressFill).width;
    }

    autoplayButton.textContent = 'Play';
    autoplayButton.setAttribute('aria-label', 'Play automatic sliding');
}

// this makes sure the timer resatrt when user clcks any arrowor dot in carousel
function restartAutoplayTimer() {
    if (timer !== null) {
        clearTimeout(timer);

        timer = null;
        timerStartTime = null;
        timeRemaining = autoplayDelay;

        progressFill.style.transition = 'none';
        progressFill.style.width = '0%';
        progressBar.setAttribute('aria-valuenow', '0');

        startAutoplay();
    }
}
//this is when user hovers through teh product it will pasue and the progress bar will start again when user leaver the mousefrom the product

let wasAutoplayRunningBeforeHover = false;

slider.addEventListener('mouseenter', function () {
    wasAutoplayRunningBeforeHover = timer !== null;

    if (wasAutoplayRunningBeforeHover) {
        pauseAutoplay();
    }
});

// Resume autoplay when the mouse leaves the carousel.
slider.addEventListener('mouseleave', function () {
    if (wasAutoplayRunningBeforeHover) {
        startAutoplay();
    }

    wasAutoplayRunningBeforeHover = false;
});

// this function handles the clicks
document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    // this is to restart the autoplat bar timer once someone clicks the left or right arrow or dot
    if (event.target.closest('.carousel-dot')) {
        restartAutoplayTimer();
    }

    //this is to pop up the message add to cart
    const addToCartButton = event.target.closest('.add-to-cart');

    if (addToCartButton) {
        const productName = addToCartButton
            .closest('.thumbnail')
            .querySelector('h2').textContent;

        cartMessage.textContent = `${productName} added to cart`;
        cartMessage.classList.add('is-visible');

        clearTimeout(cartMessageTimer);

        cartMessageTimer = setTimeout(function () {
            cartMessage.classList.remove('is-visible');
        }, 2500);
    }

    // Tthsi is wishlist toggle button .
    const wishlistButton = event.target.closest('.wishlist-toggle');

    if (wishlistButton) {
        const isWishlisted = wishlistButton.getAttribute('aria-pressed') !== 'true';

        const productName = wishlistButton
            .closest('.thumbnail')
            .querySelector('h2').textContent;

        wishlistButton.setAttribute('aria-pressed', String(isWishlisted));

        wishlistButton.setAttribute(
            'aria-label',
            `${isWishlisted ? 'Remove' : 'Add'} ${productName} ${isWishlisted ? 'from' : 'to'} wishlist`
        );
    }
});

// this is play pause button on the click.
autoplayButton.addEventListener('click', function () {
    if (timer === null) {
        startAutoplay();
    } else {
        pauseAutoplay();
    }
});

// this is start the autoplay automatically whenerver user loads the page
startAutoplay();

// Adjust the scroll position if the window size changes.
window.addEventListener('resize', function () {
    const maxScrollLeft = Math.max(
        0,
        slider.scrollWidth - slider.clientWidth
    );

    //this is to make sure slider does not get out of bound when windoes is resized

    slider.scrollLeft = Math.min(
        slider.scrollLeft,
        maxScrollLeft
    );
});