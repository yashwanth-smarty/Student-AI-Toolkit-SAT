import './App.css'
import {BrowserRouter as Router, Routes, Route, useNavigate, BrowserRouter} from "react-router-dom";
import Home from './components/Home';
import About from './components/About';
import Help from './components/Help';
import Contact from './components/Contact';
import CodeAssistant from './components/CodeAssistant';
import GrammarGuide from './components/GrammarGuide';
import SmartSynopsis from './components/SmartSynopsis';
import EasyNotes from './components/EasyNotes';
import Dashboard from './components/Dashboard';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import MailCrafter from './mailcrafter';
import DocuMentor from './DocuMentor';
import ResumeCritique from './ResumeCritique';

const clerkPubKey = "pk_test_Y29tbXVuYWwtcmF2ZW4tNzcuY2xlcmsuYWNjb3VudHMuZGV2JA";

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
 
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/codeassistant" element={<CodeAssistant />} />
        <Route path="/grammarguide" element={<GrammarGuide />} />
        <Route path='/fileinquiry' element={<SmartSynopsis />} />
        <Route path='/easynotes' element={<EasyNotes />} />
        <Route path='/mailcrafter' element={<MailCrafter/>}/>
        <Route path='/documentor' element={<DocuMentor/>}/>
        <Route path='/resumecritique' element={<ResumeCritique/>}/>
        <Route path="about" element={<About />} />
        <Route path="help" element={<Help />} />
        <Route path="contact" element={<Contact />} />
        <Route
          path="/sign-in/*"
          element={<SignIn redirectUrl={'/dashboard'} routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp redirectUrl={'/dashboard'} routing="path" path="/sign-up" />}
        />
        <Route
          path="/dashboard"
          element={
          <>
            <SignedIn>
              <ProtectedPage />
            </SignedIn>
             <SignedOut>
              <RedirectToSignIn />
           </SignedOut>
          </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

function ProtectedPage() {
  return (
    <>
    <SignedIn>
      <Dashboard />
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>    
  )
}

export default App
