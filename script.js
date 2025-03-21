const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.8;
let drawing = false;
let history = [];
let redoStack = [];
let brushColor = "black";
let brushSize = 2;

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

document.getElementById("undo").addEventListener("click", undo);
document.getElementById("redo").addEventListener("click", redo);
document.getElementById("save").addEventListener("click", saveDrawing);
document.getElementById("clear").addEventListener("click", clearCanvas);
document.getElementById("colorPicker").addEventListener("input", (e) => brushColor = e.target.value);
document.getElementById("brushSize").addEventListener("input", (e) => brushSize = e.target.value);

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function startDrawing(event) {
    drawing = true;
    ctx.beginPath();
    const pos = getMousePos(event);
    ctx.moveTo(pos.x, pos.y);
    saveState();
}

function draw(event) {
    if (!drawing) return;
    const pos = getMousePos(event);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.closePath();
}

function saveState() {
    history.push(canvas.toDataURL());
    redoStack = [];
}

function undo() {
    if (history.length > 0) {
        redoStack.push(history.pop());
        let img = new Image();
        img.src = history[history.length - 1] || "";
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function redo() {
    if (redoStack.length > 0) {
        history.push(redoStack.pop());
        let img = new Image();
        img.src = history[history.length - 1];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
    }
}

function saveDrawing() {
    let fileName = prompt("Enter file name:", "drawing");
    if (fileName) {
        let link = document.createElement("a");
        link.download = fileName + ".png";
        link.href = canvas.toDataURL();
        link.click();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((error) => console.error('Service Worker Registration Failed:', error));
}