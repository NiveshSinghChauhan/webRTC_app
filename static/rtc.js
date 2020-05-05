
const socket = io('http://localhost:3000');
let peerConnection;
let dataChannel;


socket.on('message', (data) => {

    switch (data.type) {
        case 'offer':
            onOffer(data.offer);
            break;

        case 'answer':
            onAnswer(data.answer);
            break;

        case 'ice':
            onIce(data.ice);
            break;

        case 'hangup':
            console.log('remote hungup');
            break;
    }
})





async function onAnswer(answer) {
    console.log('answer recieved');
    const remoteDesc = new RTCSessionDescription(answer);
    await peerConnection.setRemoteDescription(remoteDesc);
}

function onIce(ice) {

    console.log('recieved ice: ');
    if (ice) {
        peerConnection.addIceCandidate(ice);
    }
}

async function onOffer(offer) {
    console.log('offer recieved');

    peerConnection = new RTCPeerConnection();

    peerConnection.addEventListener("datachannel", (e) => {
        dataChannel = e.channel
        dataChannel.binaryType = 'arraybuffer';

        console.log('recieved dc: ');
        addDataChannelListners(dataChannel);

    })

    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
            // socket.emit('message', { type: 'ice', ice: e.candidate })
        } else {
            console.log('all ice sent');

        }
    };

    addListners(peerConnection);

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit('message', { type: 'answer', answer });
    console.log('answer sent');

}


function createDatachannel() {
    dataChannel = peerConnection.createDataChannel('message', { ordered: true });

    dataChannel.binaryType = 'arraybuffer';

    addDataChannelListners(dataChannel);
}

function sendMessage() {
    if (!messageInput.value.trim()) return;
    dataChannel.send(messageInput.value);
    appendMessage('local', messageInput.value);
}



async function Disconnect() {
    if (dataChannel) {
        dataChannel.close();
    }
    peerConnection.close();
    peerConnection = null;
    socket.emit('message', { type: 'hangup' })
    console.log('local connection closed\n====================');
}


async function connectWithSocket() {
    peerConnection = new RTCPeerConnection();

    createDatachannel();

    peerConnection.onicecandidate = (e) => {
        if (e.candidate) {
            socket.emit('message', { type: 'ice', ice: e.candidate })
        } else {
            console.log('all ice sent');
        }
    };


    addListners(peerConnection);


    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    console.log('offer sent');

    socket.emit('message', { type: 'offer', offer });
}



function addListners(connection) {

    connection.addEventListener("signalingstatechange", (e) => {
        console.log('signaling -> ', connection.signalingState);
    })

    connection.addEventListener("iceconnectionstatechange", (e) => {
        console.log('ice -> ', connection.iceConnectionState);
    })

    connection.addEventListener("connectionstatechange", (e) => {
        console.log('connection -> ', connection.connectionState);
    })
}


function addDataChannelListners(channel) {
    channel.addEventListener('open', (e) => {
        console.log('dc open: ');

    })

    channel.addEventListener('message', (e) => {
        console.log('dc message: ');
        appendMessage('remote', e.data);
    })

    channel.addEventListener('close', (e) => {
        console.log('dc close: ');
    })

    channel.addEventListener('error', (e) => {
        console.log('dc error: ');
    })

}