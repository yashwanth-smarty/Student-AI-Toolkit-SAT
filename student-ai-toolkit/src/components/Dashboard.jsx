import Navbar from "./Navbar";
import Footer from "./Footer";
import HomeSection from "./HomeSection";
import { UserButton } from "@clerk/clerk-react";

function Dashboard() {
    return (
      <div>
        <Navbar />
        <HomeSection />
        <Footer />
      </div>
    );
  }
  

export default Dashboard;