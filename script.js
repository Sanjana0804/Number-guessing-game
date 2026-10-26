
/* ========================================
   GUESSIT — ELEMENTS
======================================== */

const guessForm = document.getElementById("guessForm");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const restartButton = document.getElementById("restartButton");

const message = document.getElementById("message");
const attemptsDisplay = document.getElementById("attempts");
const remainingDisplay = document.getElementById("remaining");
const bestScoreDisplay = document.getElementById("bestScore");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const celebration = document.getElementById("celebration");
const winningNumber = document.getElementById("winningNumber");
const winningAttempts = document.getElementById("winningAttempts");
const celebrateAgainButton = document.getElementById("celebrateAgain");
const confettiContainer = document.getElementById("confettiContainer");

const MAX_RANGE = 100;

let numberToGuess;
let numberOfTries = 0;
let hasGuessedCorrectly = false;


/* ========================================
   BEST SCORE STORAGE
======================================== */

function getBestScore() {
    try {
        const savedScore = localStorage.getItem("guessItBestScore");

        if (savedScore === null || savedScore.trim() === "") {
            return null;
        }

        const score = Number(savedScore);

        return Number.isSafeInteger(score) && score > 0
            ? score
            : null;
    } catch (error) {
        // The game still works if browser storage is unavailable.
        return null;
    }
}

function saveBestScore(score) {
    try {
        localStorage.setItem("guessItBestScore", String(score));
        return true;
    } catch (error) {
        return false;
    }
}

function updateBestScore() {
    if (!bestScoreDisplay) return;

    const bestScore = getBestScore();
    bestScoreDisplay.textContent = bestScore ?? "—";
}


/* ========================================
   GAME MESSAGE
======================================== */

function showMessage(text, type = "") {
    if (!message) return;

    message.textContent = text;
    message.className = "message";

    if (type) {
        message.classList.add(type);
    }
}


/* ========================================
   CONFETTI CELEBRATION
======================================== */

function showCelebration(number, attempts) {
    // Allow the game to work even if the overlay is missing.
    if (
        !celebration ||
        !winningNumber ||
        !winningAttempts ||
        !confettiContainer
    ) {
        return;
    }

    winningNumber.textContent = number;
    winningAttempts.textContent =
        attempts + (attempts === 1 ? " attempt" : " attempts");

    // Remove old confetti before starting a new celebration.
    confettiContainer.replaceChildren();

    // Show the celebration overlay.
    celebration.classList.remove("hidden");

    const colors = [
        "#ff4d8d",
        "#ffd166",
        "#06d6a0",
        "#70d6ff",
        "#b388ff",
        "#ffffff",
        "#ff784f"
    ];

    const fragment = document.createDocumentFragment();

    // Create 160 confetti pieces.
    for (let i = 0; i < 160; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti";

        // Alternate between the left and right sides.
        const fromLeft = i % 2 === 0;

        piece.style.left = fromLeft
            ? `${Math.random() * 35}%`
            : `${65 + Math.random() * 35}%`;

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.setProperty(
            "--fall-duration",
            `${2.5 + Math.random() * 3}s`
        );

        piece.style.setProperty(
            "--drift",
            `${Math.random() * 300 - 150}px`
        );

        piece.style.setProperty(
            "--spin",
            `${Math.random() * 1080 - 540}deg`
        );

        piece.style.animationDelay = `${Math.random() * 0.6}s`;

        // Mix circular and rectangular confetti.
        if (Math.random() > 0.5) {
            piece.style.width = "9px";
            piece.style.height = "9px";
            piece.style.borderRadius = "50%";
        }

        fragment.appendChild(piece);
    }

    confettiContainer.appendChild(fragment);

    // Move keyboard focus to the Play Again button.
    if (celebrateAgainButton) {
        celebrateAgainButton.focus({ preventScroll: true });
    }
}


/* ========================================
   CLOSE CELEBRATION
======================================== */

function closeCelebration() {
    if (celebration) {
        celebration.classList.add("hidden");
    }

    if (confettiContainer) {
        confettiContainer.replaceChildren();
    }

    startNewGame();
}


/* ========================================
   START / RESTART GAME
======================================== */

function startNewGame() {
    // Hide the overlay and clear any existing confetti.
    if (celebration) {
        celebration.classList.add("hidden");
    }

    if (confettiContainer) {
        confettiContainer.replaceChildren();
    }

    // Generate a random integer from 1 to 100.
    numberToGuess = Math.floor(Math.random() * MAX_RANGE) + 1;

    numberOfTries = 0;
    hasGuessedCorrectly = false;

    // Reset the input and buttons.
    guessInput.value = "";
    guessInput.disabled = false;
    guessButton.disabled = false;

    // Reset game statistics.
    attemptsDisplay.textContent = "0";
    remainingDisplay.textContent = "∞";

    progressBar.style.width = "0%";
    progressText.textContent = "Ready to play";

    showMessage("✨ Make your first guess to get started!");

    updateBestScore();

    // Return focus to the input without forcing the page to scroll.
    guessInput.focus({ preventScroll: true });
}


/* ========================================
   CHECK USER GUESS
======================================== */

guessForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Prevent additional guesses after winning.
    if (hasGuessedCorrectly) {
        return;
    }

    const inputValue = guessInput.value.trim();
    const playerGuess = Number(inputValue);

    // Validate the input.
    if (
        inputValue === "" ||
        !Number.isInteger(playerGuess) ||
        playerGuess < 1 ||
        playerGuess > MAX_RANGE
    ) {
        showMessage(
            "⚠️ Enter a whole number between 1 and 100.",
            "error"
        );

        guessInput.focus();
        return;
    }

    // Count only valid guesses.
    numberOfTries++;

    attemptsDisplay.textContent = numberOfTries;

    // Update progress.
    const progress = Math.min(numberOfTries * 5, 100);

    progressBar.style.width = `${progress}%`;

    progressText.textContent =
        `${numberOfTries} guess${numberOfTries === 1 ? "" : "es"}`;

    /* ------------------------------------
       GUESS IS TOO LOW
    ------------------------------------ */

    if (playerGuess < numberToGuess) {
        showMessage(
            "📉 Too low! Try a higher number."
        );
    }

    /* ------------------------------------
       GUESS IS TOO HIGH
    ------------------------------------ */

    else if (playerGuess > numberToGuess) {
        showMessage(
            "📈 Too high! Try a lower number."
        );
    }

    /* ------------------------------------
       CORRECT GUESS
    ------------------------------------ */

    else {
        hasGuessedCorrectly = true;

        progressBar.style.width = "100%";
        progressText.textContent = "Challenge completed!";

        // Check whether this is a new personal best.
        const bestScore = getBestScore();

        const isNewBestScore =
            bestScore === null || numberOfTries < bestScore;

        if (isNewBestScore) {
            saveBestScore(numberOfTries);
            updateBestScore();
        }

        // Display the success message.
        if (isNewBestScore) {
            showMessage(
                `🏆 NEW BEST SCORE! You guessed it in ` +
                `${numberOfTries} ` +
                `${numberOfTries === 1 ? "attempt!" : "attempts!"}`,
                "success"
            );
        } else {
            showMessage(
                `🎉 Correct! You guessed ${numberToGuess} in ` +
                `${numberOfTries} ` +
                `${numberOfTries === 1 ? "attempt!" : "attempts!"}`,
                "success"
            );
        }

        // Disable further guesses.
        guessInput.disabled = true;
        guessButton.disabled = true;

        remainingDisplay.textContent = "✓";

        // Show the celebration and confetti.
        showCelebration(numberToGuess, numberOfTries);
    }

    // Select the input so the next guess is easy to enter.
    if (!hasGuessedCorrectly) {
        guessInput.select();
    }
});


/* ========================================
   BUTTON EVENT LISTENERS
======================================== */

// Main game restart button.
restartButton.addEventListener("click", startNewGame);

// Play Again button in the celebration overlay.
if (celebrateAgainButton) {
    celebrateAgainButton.addEventListener("click", function (event) {
        event.preventDefault();
        closeCelebration();
    });
}

// Start the first game.
startNewGame();
