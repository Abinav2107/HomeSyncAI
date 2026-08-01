const WORKER = "https://homesynic-ai-apk.abinavboopathi21.workers.dev";

const lightBtn = document.getElementById("lightBtn");
const fanBtn = document.getElementById("fanBtn");
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

let lightState = false;
let fanState = false;

// ==========================
// Button Controls
// ==========================

lightBtn.onclick = async function () {
    lightState = !lightState;

    try {
        await fetch(WORKER + (lightState ? "/light/on" : "/light/off"));
    } catch (e) {
        console.log(e);
    }

    updateButtonUI();
};

fanBtn.onclick = async function () {
    fanState = !fanState;

    try {
        await fetch(WORKER + (fanState ? "/fan/on" : "/fan/off"));
    } catch (e) {
        console.log(e);
    }

    updateButtonUI();
};

// ==========================
// Update Button UI
// ==========================

function updateButtonUI() {

    lightBtn.innerHTML = lightState ? "ON" : "OFF";
    lightBtn.style.background = lightState ? "green" : "#2563eb";

    fanBtn.innerHTML = fanState ? "ON" : "OFF";
    fanBtn.style.background = fanState ? "green" : "#2563eb";
}

// ==========================
// Read status from Worker
// ==========================

async function updateButtons() {

    try {

        const response = await fetch(WORKER + "/status");
        const data = await response.json();

        lightState = (data.light === "On");
        fanState = (data.fan === "On");

        updateButtonUI();

    } catch (e) {
        console.log(e);
    }
}

// ==========================
// Chat
// ==========================

function addMessage(sender, message) {

    chatBox.innerHTML += `<p><b>${sender}:</b> ${message}</p>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    if (sender === "HomeSync AI") {

        speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(message);
        speech.lang = "en-US";

        speechSynthesis.speak(speech);
    }
}

// ==========================
// AI Commands
// ==========================

async function sendMessage() {

    const text = input.value.trim().toLowerCase();

    if (text === "") return;

    addMessage("You", input.value);

    if (text.includes("light") && text.includes("on")) {

        await fetch(WORKER + "/light/on");

        lightState = true;

        updateButtonUI();

        addMessage("HomeSync AI", "Light turned ON.");

    }

    else if (text.includes("light") && text.includes("off")) {

        await fetch(WORKER + "/light/off");

        lightState = false;

        updateButtonUI();

        addMessage("HomeSync AI", "Light turned OFF.");

    }

    else if (text.includes("fan") && text.includes("on")) {

        await fetch(WORKER + "/fan/on");

        fanState = true;

        updateButtonUI();

        addMessage("HomeSync AI", "Fan turned ON.");

    }

    else if (text.includes("fan") && text.includes("off")) {

        await fetch(WORKER + "/fan/off");

        fanState = false;

        updateButtonUI();

        addMessage("HomeSync AI", "Fan turned OFF.");

    }

    else if (text.includes("hello")) {

        addMessage("HomeSync AI", "Hello! Nice to meet you.");

    }

    else if (text.includes("how are you")) {

        addMessage("HomeSync AI", "I'm doing great! Ready to control your smart home.");

    }

    else if (text.includes("good morning")) {

        addMessage("HomeSync AI", "Good morning! Have a wonderful day.");

    }

    else if (text.includes("good night")) {

        addMessage("HomeSync AI", "Good night! Sleep well.");

    }

    else {

        addMessage(
            "HomeSync AI",
            "Try saying Turn on the light or Turn off the fan."
        );

    }

    input.value = "";
}

// ==========================
// Voice Recognition
// ==========================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("Speech Recognition not supported.");

        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    addMessage("HomeSync AI", "Listening...");

    recognition.onresult = function (event) {

        input.value = event.results[0][0].transcript;

        sendMessage();

    };

    recognition.start();
}

// ==========================
// Start
// ==========================

window.onload = function () {

    addMessage(
        "HomeSync AI",
        "Hello! Welcome to HomeSync AI. How can I help you today?"
    );

    updateButtons();

    setInterval(updateButtons, 1000);
};
