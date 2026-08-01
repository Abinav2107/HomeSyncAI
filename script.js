const WORKER = "https://homesynic-ai-apk.abinavboopathi21.workers.dev";

const lightBtn = document.getElementById("lightBtn");
const fanBtn = document.getElementById("fanBtn");

let lightState = false;
let fanState = false;

// Light Button
lightBtn.onclick = async () => {

    lightState = !lightState;

    try{
        await fetch(WORKER + (lightState ? "/light/on" : "/light/off"));
    }catch(e){
        console.log(e);
    }

    lightBtn.innerHTML = lightState ? "ON" : "OFF";
    lightBtn.style.background = lightState ? "green" : "#2563eb";
};

// Fan Button
fanBtn.onclick = async () => {

    fanState = !fanState;

    try{
        await fetch(WORKER + (fanState ? "/fan/on" : "/fan/off"));
    }catch(e){
        console.log(e);
    }

    fanBtn.innerHTML = fanState ? "ON" : "OFF";
    fanBtn.style.background = fanState ? "green" : "#2563eb";
};

// ===============================
// HomeSync AI Assistant
// ===============================

const chatBox = document.getElementById("chatBox");

function addMessage(sender,message){

    chatBox.innerHTML += `<p><b>${sender}:</b> ${message}</p>`;

    chatBox.scrollTop = chatBox.scrollHeight;

}

async function sendMessage(){

    const input=document.getElementById("userInput");

    const text=input.value.toLowerCase().trim();

    if(text==="") return;

    addMessage("You",input.value);

    if(text.includes("light") && text.includes("on")){

        await fetch(WORKER+"/light/on");

        lightState=true;

        lightBtn.innerHTML="ON";

        lightBtn.style.background="green";

        addMessage("HomeSync AI","💡 Light turned ON");

    }

    else if(text.includes("light") && text.includes("off")){

        await fetch(WORKER+"/light/off");

        lightState=false;

        lightBtn.innerHTML="OFF";

        lightBtn.style.background="#2563eb";

        addMessage("HomeSync AI","💡 Light turned OFF");

    }

    else if(text.includes("fan") && text.includes("on")){

        await fetch(WORKER+"/fan/on");

        fanState=true;

        fanBtn.innerHTML="ON";

        fanBtn.style.background="green";

        addMessage("HomeSync AI","🌀 Fan turned ON");

    }

    else if(text.includes("fan") && text.includes("off")){

        await fetch(WORKER+"/fan/off");

        fanState=false;

        fanBtn.innerHTML="OFF";

        fanBtn.style.background="#2563eb";

        addMessage("HomeSync AI","🌀 Fan turned OFF");

    }

    else{

        addMessage(
            "HomeSync AI",
            "I understand commands like: Turn on the light, Turn off the fan."
        );

    }
    // ===============================
// Sync button states from Cloudflare
// ===============================

async function updateButtons() {

    try {

        const response = await fetch(WORKER + "/status");
        const data = await response.json();

        // Light
        lightState = (data.light === "On");
        lightBtn.innerHTML = lightState ? "ON" : "OFF";
        lightBtn.style.background = lightState ? "green" : "#2563eb";

        // Fan
        fanState = (data.fan === "On");
        fanBtn.innerHTML = fanState ? "ON" : "OFF";
        fanBtn.style.background = fanState ? "green" : "#2563eb";

    } catch (e) {
        console.log(e);
    }

}

// Update every second
setInterval(updateButtons, 1000);

// Update immediately when page loads
updateButtons();
    // ===============================
// Voice Control
// ===============================

function startVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = function(event) {

        const command = event.results[0][0].transcript;

        document.getElementById("userInput").value = command;

        sendMessage();

    };

    recognition.start();

}

    input.value="";

}
