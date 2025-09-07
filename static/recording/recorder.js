let mediaRecorder;
let audioChunks = [];
let timerInterval;
let seconds = 0;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const player = document.getElementById('player');
const recordingsList = document.getElementById('recordingsList');
const recordingIndicator = document.getElementById('recordingIndicator');
const timer = document.getElementById('timer');

// Start Recording
startBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true});
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    audioChunks = [];


    mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        player.src = URL.createObjectURL(audioBlob);

        

        // Upload the audioBlob to the server / send to backend
        const formData = new FormData();
        formData.append("audio_file", audioBlob, `recording-${Date.now()}.webm`);
        formData.append('title', 'New Audio Recording');
        

        fetch('/upload/', {
            method: 'POST',
            body: formData,
            headers: { 'X-CSRFToken': getCookie('csrftoken') }
        })
        .then(res => res.json())
        .then(data => {
            console.log("Upload response: ", data);
            if (data.success) {
                // Add new recording without reloading the page
                const item = document.createElement('div');
                item.classList.add("recording-item");
                item.innerHTML = `
                    <p>${data.title} (${data.created_at})</p>
                    <audio controls src="${data.file_url}"></audio>
                `;
                recordingsList.prepend(item);
            } else {
                alert("Failed to upload recording: " + JSON.stringify(data));
            }
        });
    });

    // UI changes
    startBtn.disabled = true;
    stopBtn.disabled = false;
    recordingIndicator.style.display = 'block'; // inline
    startTimer();
});

// Stop recording
stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    stopBtn.disabled = true;
    startBtn.disabled = false;
    recordingIndicator.style.display = 'none';
    stopTimer();
});

// Timer functions
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
        let secs = String(seconds % 60).padStart(2, "0");
        timer.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}
