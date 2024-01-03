import React from "react";
import {Link} from "react-router-dom";


export default class StartPage extends React.Component{
    render() {
        return (
            <div>
                {/* <p>介绍Part A, Part B的考试内容 结束后会产生report</p> */}
                <div className="heading">
                    <p className="part">Instruction</p>
                    <p className="guide">Part A: Group Discussion</p>
                    <p className="guide">Part B: Individual Response</p>
                </div>
                <div className="board">
                    <div className="video_container">
                        <div className="camera_subcontainer">
                            <video id="video_player" src="https://rr4---sn-i3belnl7.googlevideo.com/videoplayback?expire=1704276958&ei=ft-UZZOEIN-L1d8P2fylmAo&ip=43.129.69.57&id=o-ALeMMSmTWpk3tOkWwjfTU5tQFcDX-sJZwVEM5OkZWudc&itag=22&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=3x&mm=31%2C26&mn=sn-i3belnl7%2Csn-un57enez&ms=au%2Conr&mv=m&mvi=4&pl=19&initcwndbps=1510000&spc=UWF9f68krDKOeb0Sl0V0PI0zKkkznhM&vprv=1&svpuc=1&mime=video%2Fmp4&cnr=14&ratebypass=yes&dur=7.592&lmt=1703023372525434&mt=1704254955&fvip=2&fexp=24007246&c=ANDROID&txp=6218224&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIgHmVrn64hJP1r3ECHPtgbKkdSUSqMbKsD0JOSqnsgJk4CIQDZETa3Qet0-DESADxrY6KQSz9iHBTSS7jvYvBhIBNo0Q%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRAIgNqu0Sq4Ae9-9CNXKTKUYAlVfl7ohkD8mC3CYrQbgBu0CIBuRmYipxxDJAqfo14GxFvJURb_953jIixZXhpNxkU4s" autoPlay></video>
                            <button className="button">
                                <Link to="/partA/introduction">start</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
