import Usecases from "../components/Usecases";
import Body from "../components/Body";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import Navbar from "../components/Navbar";
import Steps from "../components/Steps"; 

const Homepage = () => {
  return (
    <div >
      {/* Top Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection/>

      {/* Story, Mission, Vision*/}
      <Body />

      {/* How It Works */}
       <Steps />

      {/* Enterprise Usecases */}
      <Usecases />

      {/* Footer */}
      <Footer />
      </div>
  );
};

export default Homepage;
