document.addEventListener('DOMContentLoaded', () => {
    const complimentButton = document.getElementById('complimentButton');
    const complimentTextElement = document.getElementById('complimentText');
    let compliments = [
        "Your positivity is infectious! ☀️",
        "You bring out the best in other people. ✨",
        "You make a bigger impact than you realize. 🌍",
        "You're a smart cookie! 🍪",
        "You are awesome! 🤩",
        "I bet you make babies smile. 😊",
        "You have a great sense of humor! 😂",
        "You're more helpful than you realize. 🙏",
        "You're so thoughtful. 🤔💖",
        "Your kindness is a balm to all who encounter it. 🌷",
        "You're braver than you believe. 🦁",
        "You are making a difference. 🌟",
        "You're like a ray of sunshine on a cloudy day. 🌦️➡️☀️",
        "You have the best laugh. 😄",
        "You light up the room.💡",
        "You deserve a hug right now. 🤗",
        "You're a great listener. 👂💬",
        "You're inspiring! 💫",
        "You're one of a kind! 🦄",
        "If cartoon bluebirds were real, a bunch of them would be sitting on your shoulders singing right now. 🐦🎶",
        "You're a true gem. 💎",
        "Your creativity is remarkable. 🎨",
        "You make my day brighter. 🌞",
        "You have a heart of gold. 💛",
        "You're doing great! 👍"
    ]
    
    async function loadCompliments() {
        try {
            const response = await fetch('compliments.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            compliments = await response.json();
            if (compliments.length === 0) {
                complimentTextElement.textContent = "Wait Click The Button For Your Message 🤔";
                return;
            }
            displayInitialCompliment(); // Display one after loading
        } catch (error) {
            console.error("Could not load compliments:", error);
            complimentTextElement.textContent = "Wait Click The Button For Your Message 🤔";
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
