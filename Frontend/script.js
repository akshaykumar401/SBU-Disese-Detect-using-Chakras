const tableBody = document.getElementById("table-body");
const startRecordingButton = document.getElementById("start-recording");
const stopRecordingButton = document.getElementById("stop-recording");


let mediaRecorder;
let audioChunks = [];

startRecordingButton.onclick = async (event) => {
  event.preventDefault();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };

  mediaRecorder.start();
  startRecordingButton.disabled = true;
  stopRecordingButton.disabled = false;
};

stopRecordingButton.onclick = async (e) => {
  e.preventDefault();
  mediaRecorder.stop();
  
  mediaRecorder.onstop = async (event) => {
    const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

    audioChunks = [];

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.error(error));
  

    alert("Uploaded!");
  };

  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;
};