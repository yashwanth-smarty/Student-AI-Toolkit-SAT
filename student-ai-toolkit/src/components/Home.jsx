import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Home.css";
import {  SignedOut } from "@clerk/clerk-react";
import { useSpring, animated } from 'react-spring';

function Home(){
    const fadeIn = useSpring({
        opacity: 1,
        from: { opacity: 0 },
        config: { duration: 1000 },
      });
    return(
        <div>
            <Navbar />
            {/* Home */}
            <animated.div className="landing-page" style={fadeIn}>
      <div className="content">
        <h1>Welcome to the Student AI Toolkit</h1>
        <p>Your Personalized Learning and Well-Being Companion!</p>
        <p>
          This AI toolkit harnesses the power of Artificial Intelligence,
          specifically the GPT Turbo-3.5 API, to offer tailored solutions to
          both academic and personal obstacles.
        </p>
        <p>
          Student AI Toolkit caters to individual learning styles, offers
          real-time assistance beyond class hours, and tackles tasks with
          features like:File Inquiry, Resume Critique, Code Assistant, Easy Notes, Grammar Guide, , Email Composer, DocuMentor.
        </p>
        
        <SignedOut>
            <a className="sign-in" href="/sign-in">
                Sign-in
            </a>
            <a className="sign-up" href="/sign-up">
                Sign-up
            </a>
            </SignedOut>
      </div>
    </animated.div>
            <Footer />
        </div>
    )
}
 export default Home;