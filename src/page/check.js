import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../css/check.css'

let mTimer = null;
const detectionIntervalTime = 1000;




function Dialog( {handleClick} ) {
    const allow = () => {handleClick(true)};
    const deny = () => {handleClick(false)};

    return (
        <div className="dialog">
            <div className="dialog_container">
                <p className="permission_inquiry">During the mock test, your camera and microphone will be accessed. 
                The recorded video and audio data will only be used for the purpose of further development and improvement of this system.</p>
                <p className="permission_inquiry">If you agree to grant permission, please click "Accept". If you disagree, please click "Deny", and the page will automatically return.</p>
                <div className="button_container">
                    <button className="allow" onClick={allow}>Accept</button>
                    <button className="deny" onClick={deny}>Deny</button>
                </div>
            </div>
        </div>
    );
}


function CheckPage() {
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [showDialog, setShowDialog] = useState(true);
    const [rejectPermission, setRejectPermission] = useState(false);
    const [startMedia, setStartMedia] = useState(false);

    var mStream = null;
    var mSVG = <svg t="1704441353261" id="contour" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5139" width="200" height="200"><path d="M513.256442 32.981595c81.668712 0 144.804908 23.558282 186.581595 70.360736 23.244172 26.071166 38.635583 57.796319 47.744785 93.919019 10.051534 41.462577 10.993865 82.611043 6.91043 129.727607l-0.628221 7.852761-0.628221 6.282208 0.31411 0.314111c21.98773 30.468712 24.500613 76.642945 10.365644 116.534969l-0.62822 1.570552c-8.795092 24.186503-22.930061 42.719018-40.520246 52.770552l-0.628221 0.314111-0.31411 1.256442c-13.820859 55.283436-42.719018 103.656442-76.014724 142.292024l-2.512883 2.826994v0.942331c0.942331 8.166871 2.198773 16.019632 3.769325 21.359509v0.314111l1.256441 0.31411c51.828221 11.936196 141.349693 50.88589 212.652761 95.489571l2.198773 1.570552c100.201227 63.764417 160.82454 134.439264 162.080982 207.626994v2.198773h-18.846626c0-65.64908-56.853988-132.868712-153.28589-193.806135l-4.397546-2.826994c-71.303067-44.603681-161.13865-82.611043-209.197546-92.662577l-5.968098-1.256441-1.884662-4.083436c-3.455215-7.22454-6.282209-21.67362-7.538651-36.122699l-0.31411-5.339878 2.512883-2.826993c33.923926-38.321472 64.078528-87.322699 77.271166-142.920246l0.628221-2.826994 0.942331-4.397546 4.083436-1.884662c15.077301-6.910429 27.641718-22.615951 35.808589-44.603681 13.192638-35.808589 10.679755-77.271166-8.795092-102.4l-0.942332-0.942332-2.198773-2.512883v-3.455215-2.198773l1.256442-11.936196v-1.570552c4.397546-46.174233 3.769325-86.694479-5.968098-126.586503-8.166871-33.609816-22.30184-62.507975-43.347239-86.066258-38.007362-42.404908-95.803681-64.078528-172.446626-64.078528s-134.439264 21.67362-172.446626 64.078528c-21.045399 23.558282-35.180368 52.456442-43.347239 86.066258-9.423313 38.949693-10.365644 78.213497-6.282209 123.131288l0.628221 6.596319 0.942331 10.051534v5.339877l-2.198773 2.512884c-20.103067 25.128834-22.615951 67.533742-9.423313 103.656441 7.852761 21.67362 20.103067 37.065031 34.552148 44.289571l0.942331 0.628221 4.083436 1.884662 0.942331 4.397546c12.878528 55.911656 42.404908 105.226994 76.328834 143.548467l1.570552 1.884662 2.512884 2.826994-0.314111 4.083436c-0.942331 14.44908-3.769325 28.89816-7.224539 36.75092l-0.314111 0.628221-1.884662 4.397546-4.711657 0.942331c-48.373006 9.737423-141.977914 49.629448-214.851534 95.803681C76.642945 855.63681 20.103067 921.91411 18.846626 986.934969v1.884663h-18.846626c0-74.130061 60.623313-145.433129 162.080982-209.825767 70.988957-44.917791 160.82454-83.867485 213.280981-96.431902l2.826994-0.628221v-0.31411c1.570552-5.339877 2.826994-13.192638 3.769325-21.359509v-0.942332l-0.628221-0.942331c-33.923926-38.949693-63.450307-88.265031-77.585276-144.176687l-0.31411-1.256442-0.628221-0.31411c-17.276074-9.737423-31.096933-27.641718-39.892025-51.2l-0.62822-1.570552c-14.76319-40.206135-12.564417-87.008589 9.737423-118.105522l0.31411-0.628221-0.942331-8.166871-0.31411-2.512883c-4.711656-48.373006-3.769325-90.463804 6.282208-132.554601 8.795092-36.43681 24.500613-68.161963 47.744785-94.233129C368.765644 56.539877 431.58773 32.981595 513.256442 32.981595z" p-id="5140"></path></svg>;



    useEffect(() => {
        if (rejectPermission) {
          navigate("../");
        }
    }, [rejectPermission, navigate]);


    useEffect(() => {
        if(!showDialog) {
            const container = document.getElementsByClassName("check_container");
            if(container){
                container[0].style.visibility = "visible";
            }
            
            getMedia();
            return () => {  
                if(mTimer !== null) {
                    clearTimeout(mTimer);
                    mTimer = null;
                    console.log("clear timer");
                } 
                if (mStream) {
                    mStream.getTracks().forEach((track) => track.stop());
                    console.log("release stream");
                }
            };
        }
        else{
            var container = document.getElementsByClassName("check_container");
            if(container) {
                container[0].style.visibility = "hidden";
            }
        }
    }, [showDialog]);


    
    useEffect(() => {
        if(startMedia) {   
            if(mTimer !== null) {
                clearTimeout(mTimer);
                mTimer = null;
            }                
            mTimer = setTimeout(detectCurrentFrame, detectionIntervalTime);
        }
    }, [startMedia]);


    function getMedia() {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            // {
            // width: { ideal: 1280 },
            // height: { ideal: 720 }}
                .then(function (stream) {
                    console.log("get");
                    mStream = stream;
                    videoRef.current.srcObject = mStream;
                    setStartMedia(true);
                })
                .catch(function (error) {
                    setRejectPermission(true);
                });
    }

    function handleDialogResult(permitted) {
        if(permitted) {
            setShowDialog(false);
        }
        else {
            setRejectPermission(true);
        }
    }

    function nextPage() {
        if(mTimer !== null) {
            clearTimeout(mTimer);
            mTimer = null;
            console.log("clear timer");
        }
        if (mStream) {
            mStream.getTracks().forEach((track) => track.stop());
            console.log("release stream");
        }
        navigate("../info");
    }


    function detectCurrentFrame() {         
        if(mTimer !== null) {
            clearTimeout(mTimer);
            mTimer = null;
        }            

        try {
            console.log("to get a frame");        
            const videoElement = videoRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL();
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.remove();
            
            // send the current video frame to the backend and wait for detetction
            // replace '/detect_face' with 'http://{your_ip}:{your_port}/detect_face' 
            fetch('/detect_face', {
                method: 'POST',
                body: JSON.stringify({
                    "camera_frame": imageData
                }),
                headers: {
                'Content-Type': 'application/json'
                },
            })
            .then(function(response) {
                URL.revokeObjectURL(imageData);
                return response.json();
            })
            .then(function(data) {
                const result = data.result;
                const info = data.info;
            
                console.log('Result:', result);
                console.log('Info:', info);

                const contourSVG = document.getElementById("contour");
                const contourGuide = document.getElementById("contour_guide");
                const continueBtn = document.getElementById("continue");
                if(result) {
                    contourSVG.style.fill = "green";
                    contourGuide.textContent = "Your upper body fits the contour. Please click \"continue\""
                    continueBtn.className = "can_continue";
                    continueBtn.onclick = nextPage;
                }
                else {
                    const infos = info.join('\n');
                    contourSVG.style.fill = "red";
                    contourGuide.textContent = infos
                    continueBtn.className = "cannot_continue";
                    continueBtn.onclick = null;

                    mTimer = setTimeout(detectCurrentFrame, detectionIntervalTime);
                }
            })
            .catch(function(error) {
                console.error('Fail to detect! ', error);
                if(mTimer === null) {
                    mTimer = setTimeout(detectCurrentFrame, detectionIntervalTime);
                }
            });

        }
        catch(error) {
            console.log(error);
        }
        
    }

    return (
        <div>
            { showDialog && <Dialog handleClick={handleDialogResult}></Dialog> }
            
            <div className="check_container">
                { startMedia && <p id="contour_guide">Please make sure your upper body approximately fits the contour, then click "continue"</p> } 
                <div className="video_area">
                    { !startMedia && <p className="call_camera">Calling camera ...</p>}
                    <video id="display" ref={videoRef} autoPlay muted playsInline></video> 
                    { startMedia && mSVG }
                </div>   
                {/* { startMedia && <button id="continue" className="cannot_continue">Continue</button>} */}
                { startMedia && <button id="continue" className="can_continue" onClick={nextPage}>Continue</button>}
            </div>
        </div>
    );

}

export default CheckPage;

