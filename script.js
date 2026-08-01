const WORKER = "https://homesynic-ai-apk.abinavboopathi21.workers.dev";

const lightBtn = document.getElementById("lightBtn");
const fanBtn = document.getElementById("fanBtn");
const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

let lightState = false;
let fanState = false;

// =======================================
// Manual Button Control
// =======================================

lightBtn.onclick = async () => {

    lightState = !lightState;

    try {
        await fetch(WORKER + (lightState ? "/light/on" : "/light/off"));
    } catch (e) {
        console.log(e);
    }

    updateLightButton();

};

fanBtn.onclick = async () => {

    fanState = !fanState;

    try {
        await fetch(WORKER + (fanState ? "/fan/on" : "/fan/off"));
    } catch (e) {
        console.log(e);
    }

    updateFanButton();

};

// =======================================
// Update Buttons
// =======================================

function updateLightButton() {

    lightBtn.innerHTML = lightState ? "ON" : "OFF";
    lightBtn.style.background = lightState ? "green" : "#2563eb";

}

function updateFanButton() {

    fanBtn.innerHTML = fanState ? "ON" : "OFF";
    fanBtn.style.background = fanState ? "green" : "#2563eb";

}

// =======================================
// Chat
// =======================================

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

// =======================================
// AI Commands
// =======================================

async function sendMessage() {

    const text = input.value.toLowerCase().trim();

    if (text == "") return;

    addMessage("You", input.value);

    if (text.includes("light") && text.includes("on")) {

        await fetch(WORKER + "/light/on");

        lightState = true;

        updateLightButton();

        addMessage("HomeSync AI", "💡 Light turned ON");

    }

    else if (text.includes("light") && text.includes("off")) {

        await fetch(WORKER + "/light/off");

        lightState = false;

        updateLightButton();

        addMessage("HomeSync AI", "💡 Light turned OFF");

    }

    else if (text.includes("fan") && text.includes("on")) {

        await fetch(WORKER + "/fan/on");

        fanState = true;

        updateFanButton();

        addMessage("HomeSync AI", "🌀 Fan turned ON");

    }

    else if (text.includes("fan") && text.includes("off")) {

        await fetch(WORKER + "/fan/off");

        fanState = false;

        updateFanButton();

        addMessage("HomeSync AI", "🌀 Fan turned OFF");

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

        addMessage("HomeSync AI",
            "I understand commands like Turn on the light or Turn off the fan.");

    }

    input.value = "";

}

// =======================================
// Voice Recognition
// =======================================

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

    recognition.maxAlternatives = 1;

    recognition.start();

    addMessage("HomeSync AI", "🎤 Listening...");

    recognition.onresult = function(event) {

        input.value = event.results[0][0].transcript;

        sendMessage();

    };

    recognition.onerror = function() {

        addMessage("HomeSync AI", "Sorry, I couldn't hear you.");

    };

}

// =======================================
// Website Sync
// =======================================

async function updateButtons() {

    try {

        const response = await fetch(WORKER + "/status");

        const data = await response.json();

        lightState = (data.light === "On");

        fanState = (data.fan === "On");

        updateLightButton();

        updateFanButton();

    }

    catch(e) {

        console.log(e);

    }

}

setInterval(updateButtons,1000);

// =======================================
// Enter Key Support
// =======================================

input.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        sendMessage();

    }

});

// =======================================
// Startup
// =======================================

window.onload = function(){

    addMessage(
        "HomeSync AI",
        "Hello! Welcome to HomeSync AI. How can I help you today?"
    );

    updateButtons();

};
