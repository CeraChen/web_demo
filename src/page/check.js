import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/check.css'


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
                    <button className="allow" onClick={allow}>Allow</button>
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

    useEffect(() => {
        if (rejectPermission) {
          navigate("../");
        }
    }, [rejectPermission, navigate]);


    useEffect(() => {
        if(!showDialog) {
            var container = document.getElementsByClassName("check_container");
            if(container){
                container[0].style.visibility = "visible";
            }
            
            getMedia();
            return () => {
                if (mStream) {
                    mStream.getTracks().forEach((track) => track.stop());
                    console.log("release");
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
        navigate("../start");
    }

    return (
        <div>
            { showDialog && <Dialog handleClick={handleDialogResult}></Dialog> }

            <div className="check_container">
                <div className="video_area">
                    { !startMedia && <p className="call_camera">Calling camera ...</p>}
                    {/* <svg t="1702478564607" className="icon" viewBox="0 0 1117 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4326" width="200" height="200"><path d="M1076.410182 22.434909l0.093091 0.093091a45.661091 45.661091 0 0 1 0 64.512L191.115636 975.034182a45.428364 45.428364 0 0 1-64.232727 0.093091l-0.093091-0.093091a45.661091 45.661091 0 0 1 0-64.512L1012.177455 22.528a45.428364 45.428364 0 0 1 64.232727-0.093091z m30.440727 162.583273a69.818182 69.818182 0 0 1 10.24 36.398545V708.887273a69.818182 69.818182 0 0 1-110.312727 56.925091L837.818182 645.678545v19.688728c0 50.129455-4.654545 77.917091-17.594182 104.866909l-3.444364 6.749091a152.529455 152.529455 0 0 1-63.348363 63.208727l-2.187637 1.163636c-27.182545 14.056727-54.272 19.362909-103.377454 19.735273H432.453818l92.858182-93.090909h118.970182c34.443636-0.093091 48.872727-2.327273 60.695273-7.633455l3.211636-1.536 1.582545-0.884363c10.891636-5.771636 19.083636-14.010182 24.901819-24.901818 7.447273-13.870545 10.053818-27.415273 10.053818-67.677091l-0.046546-117.294546L837.818182 454.609455v76.8l186.181818 132.375272V268.008727zM642.094545 69.818182c54.318545 0 82.385455 5.399273 111.616 21.038545 11.776 6.283636 22.481455 13.963636 32.023273 22.807273L719.918545 179.665455a61.905455 61.905455 0 0 0-10.146909-6.702546c-13.870545-7.447273-27.415273-10.053818-67.677091-10.053818H193.303273c-37.422545 0.139636-51.153455 2.699636-63.674182 9.169454l-1.582546 0.884364c-10.891636 5.771636-19.083636 14.010182-24.901818 24.901818C95.697455 211.735273 93.090909 225.28 93.090909 265.541818v402.245818c0.139636 37.422545 2.699636 51.153455 9.169455 63.674182l0.884363 1.582546c5.771636 10.891636 14.010182 19.083636 24.901818 24.901818 3.351273 1.815273 6.702545 3.351273 10.426182 4.608L69.818182 831.394909a152.576 152.576 0 0 1-48.919273-54.690909l-1.163636-2.187636c-14.336-27.787636-19.549091-55.389091-19.735273-106.589091V265.541818c0-54.318545 5.399273-82.385455 21.038545-111.616A152.529455 152.529455 0 0 1 84.386909 90.763636l2.187636-1.163636c27.787636-14.336 55.389091-19.549091 106.589091-19.735273z" fill="#515151" p-id="4327"></path></svg>} */}
                    <video id="display" ref={videoRef} autoPlay muted playsInline></video> 
                </div>   
                {/* if the camera is blocked, disnable the button */}     
                {/* add a contour in the video */} 
                { startMedia && <button className="continue" onClick={nextPage}>Continue</button>}
            </div>
        </div>
    );

}

export default CheckPage;

