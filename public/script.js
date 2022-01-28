const socket = io("/");
const videoGrid = document.getElementById('video-grid');
console.log(videoGrid)
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer(undefined , {
    path:'/peerjs',
    host:'/',
    port:'3030',
})
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo,stream);

    peer.on('call' , call =>{
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream' , userVideoStream =>{
            addVideoStream(video , userVideoStream)
        })
    })


    socket.on('user-connected' , (userId)=>{
        connectToNewUser(userId,stream);
    })
})

peer.on('open',id =>{
    socket.emit('join-room',ROOM_ID , id);
})

const connectToNewUser = (userId,stream) => {
    const call = peer.call(userId,stream);
    const video = document.createElement('vider');
    call.on('stream',userVideoStream => {
        addVideoStream(video,userVideoStream);
    })
}

const addVideoStream = (video,stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata',() =>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $("input");
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) { // 13 means when we are tapping enter
    console.log(text.val());
    socket.emit('message', text.val()); // firing message event.
    text.val('') // after user sent the message we need to clear the input
  }
});


socket.on('createMessage' , message =>{
    // console.log(message);
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`) // when we get the message . append it into the message list
    scrollBottom();
})

const scrollBottom = () =>{
    let d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}
/****************************** MUTE BUTTON*********************************************/
const muteUnmute = () =>{
    
    /* we will get the present state of audio track of the stream, and on clicking 
    the muteUnmute button , we will toggle the state of audio track */
    
    const enable = myVideoStream.getAudioTracks()[0].enabled;
    if(enable){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        setMuteButton();
    }
}

                /*-------BUTTONS------*/
const setMuteButton = () =>{
    const htmlTag = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = htmlTag;
}

const setUnmuteButton = () =>{
    const htmlTag = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = htmlTag;
}


/************************ STOP VIDEO *******************************/
const cameraOnOff = () =>{
    const enable = myVideoStream.getVideoTracks()[0].enabled;
    if(enable){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setCameraOnButton();
    }
    else{
        setCameraOffButton();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}
                    /*****BUTTONS*****/
const setCameraOffButton = () =>{
    const htmlTag = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector('.main__camera__button').innerHTML = htmlTag;
}

const setCameraOnButton = () =>{
    const htmlTag = `
    <i class="stop fas fa-video-slash"></i>
    <span>Start Video</span>
    `
    document.querySelector('.main__camera__button').innerHTML = htmlTag;
}


