import { Component } from "react";
import "./Navbarstyle.css";
import { Link } from "react-router-dom";
class Navbar extends Component{
    state={clicked:false };
    handleClick=()=>{
        this.setState({clicked: !this.state.clicked})
    }
    render(){
    return (
        <>
        <div className="nav">
            <Link to="/dashboard"><svg id="logo-38" width="78" height="32" viewBox="0 0 78 32" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M55.5 0H77.5L58.5 32H36.5L55.5 0Z" fill="#FF7A00"></path> <path d="M35.5 0H51.5L32.5 32H16.5L35.5 0Z"  fill="#FF9736"></path> <path d="M19.5 0H31.5L12.5 32H0.5L19.5 0Z" fill="#FFBC7D"></path> </svg></Link>
        <div>
            <ul id="navbar" className={this.state.clicked ? "#navbar active":"#navbar"}>
                <li><Link to="/dashboard">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/help">Help</Link></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </div>
        <div id="mobile" onClick={this.handleClick}>
            <i id="bar" className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        </div>
        </>
    )
}
}

export default Navbar;