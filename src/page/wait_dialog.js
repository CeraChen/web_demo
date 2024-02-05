import '../css/wait_dialog.css'

function WaitDialog({text}) {
    return (        
        <div className="waiting_dialog">
            <div className="waiting_dialog_container">  
                <p>{text || "Evaluating your answers ... Please wait for the scoring."}</p>              
                <div className="spinner"></div>
            </div>
        </div>
    );
}


export default WaitDialog;