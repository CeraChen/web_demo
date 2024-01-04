import React from "react";
import {Link} from "react-router-dom";


export default class StartPage extends React.Component{
    componentDidMount() {
        const videoPlayer = document.getElementById("video_player");
        videoPlayer.onended = () => {
            const a = document.createElement('a');
            a.href = "/partA/introduction";
            a.click();
        }
    }

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
                            <video id="video_player" src="https://rr3---sn-i3belney.googlevideo.com/videoplayback?expire=1704385551&ei=r4eWZePXD5KM0-kP65SsoAM&ip=43.129.69.57&id=o-AGIqdKu9moRjTictpABShCaMcMRd1_3O_kTfwcPc9kJq&itag=243&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=Vq&mm=31%2C29&mn=sn-i3belney%2Csn-i3b7knzs&ms=au%2Crdu&mv=m&mvi=3&pl=19&initcwndbps=1035000&vprv=1&svpuc=1&mime=video%2Fwebm&gir=yes&clen=304587&dur=12.666&lmt=1704290657428042&mt=1704362696&fvip=3&keepalive=yes&fexp=24007246&c=IOS&txp=5537434&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cvprv%2Csvpuc%2Cmime%2Cgir%2Cclen%2Cdur%2Clmt&sig=AJfQdSswRAIgc49sQt726jNBvVAiO2WWyiOoyA8iE-rwpRjrEsqlAFUCIDjZDDyqQygT03pYwb9dd0tl3ZGPX3dWprwDR5U3durv&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AAO5W4owRQIhALGeyxHDFb5qNV1Yzybms1PBoBx41S3G_W_JU5CHMoZ7AiBPjKG1Zoi2vNX_213zZGzgBX9JdVNxOu3AwkUO9_Zn8A%3D%3D" autoPlay></video>
                            {/* <button className="button">
                                <Link to="/partA/introduction">start</Link>
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
