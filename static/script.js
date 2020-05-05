const video = document.querySelector('video');
const messageInput = document.querySelector('#message');
const displayMessage = document.querySelector('#message-list');


function getMediaStream() {
    console.log('getting media');

    if (!navigator && !navigator.mediaDevices) {
        console.log("Browser not supported");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        console.log(stream);
        video.srcObject = stream;
    }).catch(error => {
        console.log(error);

    });
}



function appendMessage(from, message) {
    const li = document.createElement('li');
    li.innerText = `${from} --> ${message}`;
    displayMessage.appendChild(li);
}