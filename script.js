const video = document.querySelector('video');

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