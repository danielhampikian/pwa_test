const container = document.getElementById('app-container');
const screens = container.querySelectorAll('.screen');
let currentIndex = 0;
let startX = 0;
let endX = 0;
const threshold = 50; // Min pixels to swipe to trigger transition

// --- Event Listeners for Swiping ---
container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    // Remove transition classes before starting the swipe gesture
    screens.forEach(screen => {
        screen.classList.remove('entering-from-right', 'leaving-to-left', 'entering-from-left', 'leaving-to-right');
    });
});

container.addEventListener('touchmove', (e) => {
    // Optional: Add logic here if you want the screen to follow the finger during swipe
    // For simplicity, we'll only act on touchend
});

container.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

// --- Swipe Logic ---
function handleSwipe() {
    const diffX = startX - endX; // Positive if swiping left, negative if swiping right

    if (Math.abs(diffX) > threshold) {
        if (diffX > 0) { // Swiped left
            showNextScreen();
        } else { // Swiped right
            showPreviousScreen();
        }
    }
}

// --- Screen Management ---
function showScreen(index, direction) {
    if (index < 0 || index >= screens.length || index === currentIndex) {
        // Invalid index or same screen, do nothing
        // Ensure transition classes are removed if no transition happens
         screens.forEach(screen => {
            screen.classList.remove('entering-from-right', 'leaving-to-left', 'entering-from-left', 'leaving-to-right');
        });
        return;
    }

    const currentScreen = screens[currentIndex];
    const nextScreen = screens[index];

    // Add transition classes based on direction
    if (direction === 'left') { // Moving to the right (visually swiping right)
         currentScreen.classList.add('leaving-to-right');
         nextScreen.classList.add('entering-from-left', 'active');
    } else { // Moving to the left (visually swiping left)
        currentScreen.classList.add('leaving-to-left');
        nextScreen.classList.add('entering-from-right', 'active');
    }

     // Wait for the current screen to finish its leaving transition, then hide it
    // A setTimeout matching the transition duration is a simple way here
    // In a real app, you might use the 'transitionend' event
    setTimeout(() => {
         currentScreen.classList.remove('active', 'leaving-to-left', 'leaving-to-right');
         // Ensure the next screen has the entering class removed after its transition
         nextScreen.classList.remove('entering-from-left', 'entering-from-right');
    }, 500); // Match this duration to the CSS transition time

    currentIndex = index;
}

function showNextScreen() {
    showScreen(currentIndex + 1, 'right'); // 'right' means the new screen comes from the right
}

function showPreviousScreen() {
    showScreen(currentIndex - 1, 'left'); // 'left' means the new screen comes from the left
}

// Optional: Remove this if you just want swipe navigation
// Added for initial state setup consistency
screens[currentIndex].classList.add('active');
