document.addEventListener('DOMContentLoaded', function () {
    // Sample texts for typing test
    const sampleTexts = [
            "The quick brown fox jumps over the lazy dog.This classic pangram contains all the letters in the English alphabet.Typing quickly and accurately is an essential skill in today's digital world where communication happens at lightning speed.",
            "Programming is the art of telling another human what one wants the computer to do.Good code is its own best documentation.As you're about to add a comment, ask yourself, 'How can I improve the code so that this comment isn't needed?'",
            "The future belongs to those who believe in the beauty of their dreams.Success is not final, failure is not fatal: it is the courage to continue that counts.Life is what happens when you're busy making other plans.The only way to do great work is to love what you do."
        ];

    // DOM elements
    const textDisplay = document.getElementById('text-display');
    const userInput = document.getElementById('user-input');
    const timeDisplay = document.getElementById('time');
    const wpmDisplay = document.getElementById('wpm');
    const accuracyDisplay = document.getElementById('accuracy');
    const progressBar = document.getElementById('progress-bar');
    const resultContainer = document.getElementById('result-container');
    const finalWpmDisplay = document.getElementById('final-wpm');
    const finalAccuracyDisplay = document.getElementById('final-accuracy');
    const restartBtn = document.getElementById('restart-btn');

    // Test variables
    let timeLeft = 60;
    let timer;
    let isTestRunning = false;
    let totalTyped = 0;
    let correctTyped = 0;
    let currentText = '';
    let currentPosition = 0;

    // Initialize the test
    function initTest() {
        // Reset variables
        timeLeft = 60;
        totalTyped = 0;
        correctTyped = 0;
        currentPosition = 0;
        isTestRunning = false;

        // Clear input and hide results
        userInput.value = '';
        resultContainer.style.display = 'none';

        // Select random text
        currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];

        // Display the text with formatting
        displayText();

        // Reset displays
        timeDisplay.textContent = timeLeft;
        wpmDisplay.textContent = '0';
        accuracyDisplay.textContent = '100';
        progressBar.style.width = '0%';
        progressBar.style.backgroundColor = '#4CAF50';

        // Focus on input field
        userInput.focus();
    }

    // Display the text with formatting
    function displayText() {
        let html = '';

        for (let i = 0; i < currentText.length; i++) {
            let char = currentText[i];
            let spanClass = '';

            if (i < currentPosition) {
                spanClass = userInput.value[i] === char ? 'correct' : 'incorrect';
            } else if (i === currentPosition) {
                spanClass = 'current';
            }

            // Handle spaces (show as visible)
            if (char === ' ') {
                char = '&nbsp;';
            }

            html += `<span class="${spanClass}">${char}</span>`;
        }

        textDisplay.innerHTML = html;

        // Scroll to current position
        const currentSpan = textDisplay.querySelector('.current');
        if (currentSpan) {
            currentSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Start the test timer
    function startTimer() {
        isTestRunning = true;
        timer = setInterval(function () {
            timeLeft--;
            timeDisplay.textContent = timeLeft;

            // Update progress bar color based on time left
            if (timeLeft <= 15) {
                progressBar.style.backgroundColor = '#F44336';
            } else if (timeLeft <= 30) {
                progressBar.style.backgroundColor = '#FF9800';
            }

            // End test when time runs out
            if (timeLeft <= 0) {
                endTest();
            }
        }, 1000);
    }

    // Calculate and update WPM
    function updateWPM() {
        // WPM calculation: (correct characters / 5) / (time elapsed in minutes)
        const timeElapsed = 60 - timeLeft;
        if (timeElapsed === 0) return;

        const wpm = Math.round((correctTyped / 5) / (timeElapsed / 60));
        wpmDisplay.textContent = wpm;

        // Animate WPM display when it changes
        wpmDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            wpmDisplay.style.transform = 'scale(1)';
        }, 300);
    }

    // Calculate and update accuracy
    function updateAccuracy() {
        if (totalTyped === 0) {
            accuracyDisplay.textContent = '100';
            return;
        }

        const accuracy = Math.round((correctTyped / totalTyped) * 100);
        accuracyDisplay.textContent = accuracy;

        // Change color based on accuracy
        if (accuracy < 70) {
            accuracyDisplay.style.color = '#F44336';
        } else if (accuracy < 90) {
            accuracyDisplay.style.color = '#FF9800';
        } else {
            accuracyDisplay.style.color = '#4CAF50';
        }
    }

    // Update progress
    function updateProgress() {
        const progress = (currentPosition / currentText.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // End the test
    function endTest() {
        clearInterval(timer);
        isTestRunning = false;
        userInput.disabled = true;

        // Calculate final stats
        const timeElapsed = 60 - timeLeft;
        const finalWpm = Math.round((correctTyped / 5) / (timeElapsed / 60));
        const finalAccuracy = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;

        // Display results
        finalWpmDisplay.textContent = finalWpm;
        finalAccuracyDisplay.textContent = finalAccuracy;
        resultContainer.style.display = 'block';

        // Add confetti effect for good performance
        if (finalWpm > 50 && finalAccuracy > 90) {
            createConfetti();
        }
    }

    // Simple confetti effect
    function createConfetti() {
        const colors = ['#4CAF50', '#2196F3', '#FFEB3B', '#FF9800', '#9C27B0'];
        const container = document.querySelector('.typing-test-container');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.top = '-10px';
            confetti.style.opacity = '0.8';
            confetti.style.transform = 'rotate(0deg)';
            confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;

            container.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }

        // Add CSS for confetti animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confetti-fall {
                0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Update current year automatically
document.getElementById('current-year').textContent = new Date().getFullYear();

// Optional: Add a smooth hover effect
document.querySelectorAll('.app-footer a').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

    // Event listeners
    userInput.addEventListener('input', function (e) {
        if (!isTestRunning) {
            startTimer();
        }

        const inputText = e.target.value;
        totalTyped = inputText.length;

        // Calculate correct characters
        correctTyped = 0;
        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === currentText[i]) {
                correctTyped++;
            }
        }

        currentPosition = inputText.length;

        // Update displays
        displayText();
        updateWPM();
        updateAccuracy();
        updateProgress();

        // End test if user completes the text
        if (inputText.length >= currentText.length) {
            endTest();
        }
    });

    restartBtn.addEventListener('click', initTest);

    // Initialize the test on page load
    initTest();
});