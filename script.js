const WORKER = "https://homesynic-ai-apk.abinavboopathi21.workers.dev/";

const lightBtn = document.getElementById("lightBtn");
const fanBtn = document.getElementById("fanBtn");

let lightState = false;
let fanState = false;

lightBtn.onclick = async () => {
    lightState = !lightState;

    await fetch(
        WORKER + (lightState ? "/light/on" : "/light/off")
    );

    lightBtn.innerHTML = lightState ? "ON" : "OFF";
    lightBtn.style.background = lightState ? "green" : "#2563eb";
};

fanBtn.onclick = async () => {
    fanState = !fanState;s

    await fetch(
        WORKER + (fanState ? "/fan/on" : "/fan/off")
    );

    fanBtn.innerHTML = fanState ? "ON" : "OFF";
    fanBtn.style.background = fanState ? "green" : "#2563eb";
};