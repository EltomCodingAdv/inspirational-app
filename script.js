document.addEventListener('DOMContentLoaded', () => {
    const complimentButton = document.getElementById('complimentButton');
    const complimentTextElement = document.getElementById('complimentText');
    let compliments = []; // Initialize as empty, will be populated from JSON

    async function loadCompliments() {
        try {
            const response = await fetch('compliments.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            compliments = await response.json();
            if (compliments.length === 0) {
                complimentTextElement.textContent = "No compliments loaded. The list might be empty! 🤔";
                return;
            }
            displayInitialCompliment(); // Display one after loading
        } catch (error) {
            console.error("Could not load compliments:", error);
            complimentTextElement.textContent = "Could not load compliments. Please try again later. 😞";
        }
    }

    function displayRandomCompliment() {
        if (compliments.length > 0) {
            const randomIndex = Math.floor(Math.random() * compliments.length);
            complimentTextElement.textContent = compliments[randomIndex];
        } else {
            // This message might appear if compliments array is empty after an attempt to load
            complimentTextElement.textContent = "No compliments available right now. 😥";
        }
    }

    function displayInitialCompliment() {
        if (compliments.length > 0) {
            const initialRandomIndex = Math.floor(Math.random() * compliments.length);
            complimentTextElement.textContent = compliments[initialRandomIndex];
        }
        // If compliments didn't load or are empty, the error message from loadCompliments will persist
        // or the message from displayRandomCompliment if called by button before load completes.
    }

    // Add event listener to the button
    complimentButton.addEventListener('click', displayRandomCompliment);

    // Load compliments when the DOM is ready
    loadCompliments();
});
