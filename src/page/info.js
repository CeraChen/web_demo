import React from "react";
import "../css/info.css"



export default class InfoPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            school: '',
            school_warning: false,
            name: '',
            name_warning: false,
        };
        this.render = this.render.bind(this);
        this.gatherInfo = this.gatherInfo.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleSchoolInput = this.handleSchoolInput.bind(this);
    }

    gatherInfo() {   
        if(this.state.school === '' || this.state.name === '') {
            console.log("has void input");
            this.setState({
                school_warning: this.state.school === '',
                name_warning: this.state.name === '',
            })
        }
        else {            
            localStorage.setItem("school", this.state.school);
            localStorage.setItem("name", this.state.name);
            
            console.log("school:", localStorage.getItem("school"));
            console.log("name:", localStorage.getItem("name"));

            const a = document.createElement('a');
            a.href = "/start";   
            console.log("to jump to the next page!");         
            a.click();
        }
    }

    handleNameInput = (event) => {    
        this.setState({
            name: event.target.value,
            name_warning: false
        });
    };

    handleSchoolInput = (event) => {
        this.setState({
            school: event.target.value,
            school_warning: false
        });
    };
    

    render() {
        return (
            <div>
                {/* <p>介绍Part A, Part B的考试内容 结束后会产生report</p> */}
                <div className="heading">
                    <p className="part">Examinee's Info</p>

                    <div className="info_intro">
                        <p className="guide">Please input your school and your name:</p>
                        <div className="info_container">
                            <div className="info_items">
                                <div className="info_item">
                                    <span className="info_type">School:</span>
                                    <input className="info_input" type="text" value={this.state.school} onChange={this.handleSchoolInput}/>
                                    { this.state.school_warning && <span className="void_warning">your school cannot be void.</span>}
                                </div>
                                <div className="info_item">
                                    <span className="info_type">Name:</span>
                                    <input className="info_input" type="text" value={this.state.name} onChange={this.handleNameInput}/>
                                    { this.state.name_warning && <span className="void_warning">your name cannot be void.</span>}
                                </div>
                            </div>
                        </div>
                        <div className="button_container">
                            <button className="proceed" onClick={this.gatherInfo}>
                                Proceed
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div>
        );
    }
}
