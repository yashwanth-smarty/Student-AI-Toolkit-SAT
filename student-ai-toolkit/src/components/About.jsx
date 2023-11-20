import Navbar from "./Navbar";
import './NavbarStyle.css';
function About() {
    return (
        <div>
            <Navbar />
            <div>
            <div className='subh1'>Welcome to the Student AI Toolkit - Your Personalized Learning and Well-Being Companion!</div>
            <div className="subh2">This AI toolkit harnesses the power of Artificial Intelligence, specifically the GPT Turbo-3.5 API, to offer tailored solutions to both academic and personal obstacles.<br/><br/>

Our mission is to cater to diverse learning styles, providing real-time assistance that goes beyond traditional class hours. The toolkit excels in a wide range of tasks, from code comprehension and educational support to writing enhancement, text summarization, email composition, and documentation assistance.<br/><br/>

By seamlessly integrating AI, the Student AI Toolkit empowers students with immediate and personalized support across various domains, enhancing the overall learning experience and well-being. Join us on a journey to academic excellence and personal growth."</div>
            </div>
        </div>
    )
}

export default About;