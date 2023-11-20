import HomeBanner from "../assets/home-banner-background.png";
import './HomeSection.css';
import HomeImg1 from "../assets/home-img1.png";
// import edu from "../assets/edu.png";
import code from "../assets/code.png";
import docs from "../assets/docs.png";
import ideas from "../assets/ideas.png";
import mail from "../assets/mail.png";
import notes from "../assets/notes.png";
import tips from "../assets/tips.png";
import summ from "../assets/summ.png";
import gram from "../assets/writing.png";
import resume from "../assets/resume.png";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";
function HomeSection() {
    const { isLoaded, isSignedIn, user } = useUser();
  
    if (!isLoaded || !isSignedIn) {
      return null;
    }
    return (
        <div>
            
            <div>
                <img className="banner" src={HomeBanner} alt='HomeBanner' />
            </div>
            <div>
            <img src={HomeImg1} alt="Home Image1" className="home-img1"/>
            <div className="overlay"></div>
            </div>
            <div className="home-content">
                <h1 className="title">Student AI Toolkit</h1>
                <p className="desc">
                <br />
                <UserButton/>
                <div className="username">
                    Hello, {user.firstName}
                </div>
                <br/>
                <span id="subh1">Welcome to the Student AI Toolkit - Your Personalized Learning and Well-Being Companion!</span>
                <br />
                <br />
                </p>
            </div>
            <div className="cards">
            <div className="card summ">
                <Link to="/fileinquiry"><img src={summ} className="card-img summ"/></Link>
                    <h2 className="chead">File Inquiry</h2>
                    {/* <p className="csub">Quickly summarize lengthy texts and research materials from various file formats, including PDF, TXT, DOC, and more. </p> */}
                </div>
                <div className="card code">
                <Link to="/codeassistant"><img src={code} className="card-img code"/></Link>
                    <h2 className="chead">Code Assistant</h2>
                    {/* <p className="csub">It Debugs the code, provide documentation, explain concepts, derive code output and many more tasks effortlessly.</p> */}
                </div>
                {/* <div className="card edu">
                <Link to="/studysphere"><img src={edu} className="card-img edu"/></Link>
                    <h2 className="chead">StudySphere</h2>
                    <p className="csub">Personalized answers to any subject related queries and access to educational resources.</p>
                </div> */}
                <div className="card resume">
                <Link to="/resumecritique"><img src={resume} className="card-img resume"/></Link>
                    <h2 className="chead">Resume Critique</h2>
                    {/* <p className="csub">Analyzes and Rate the Resume by providing feedback and suggestions.</p> */}
                </div>
                <div className="card mail">
                <Link to="/mailcrafter"><img src={mail} className="card-img mail"/></Link>
                    <h2 className="chead">Mail Crafter</h2>
                    {/* <p className="csub csubmail">Easily compose professional emails with AI assistance.</p> */}
                </div>
                <div className="card notes">
                <Link to="/easynotes"><img src={notes} className="card-img notes"/></Link>
                    <h2 className="chead">Easy Notes</h2>
                    {/* <p className="csub">Effortlessly convert spoken words into written notes. Ideal for recording lectures, capturing ideas, and saving notes for assignments and study materials.</p> */}
                </div>
                <div className="card gram">
                <Link to="/grammarguide"><img src={gram} className="card-img gram"/></Link>
                    <h2 className="chead cgram">Grammar Guide</h2>
                    {/* <p className="csub">AI-powered writing suggestions, spell checking, grammar corrections and proofreading</p> */}
                </div>
                
                <div className="card docs">
                <Link to="/documentor"><img src={docs} className="card-img docs"/></Link>
                    <h2 className="chead">DocuMentor</h2>
                    {/* <p className="csub">Create professional documentation for research papers, seminars, projects, etc., in your specified format.</p> */}
                </div>
                
                {/* <div className="card ideas"> */}
                {/* <Link to="/brainstormer"><img src={ideas} className="card-img ideas"/></Link> */}
                    {/* <h2 className="chead">Brainstormer</h2> */}
                    {/* <p className="csub">Brainstorms and generates creative ideas for a wide range of topics and subjects, offering innovative insights and solutions.</p> */}
                {/* </div> */}
                    <br/>
            </div>
            
        </div>
    );
}

export default HomeSection;