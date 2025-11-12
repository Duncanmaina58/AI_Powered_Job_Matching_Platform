import React from "react";
import Header from "../components/Landingpage/Header";
import Hero from "../components/Landingpage/Hero";
import FeaturedJobs from "../components/Landingpage/FeaturedJobs";
import Footer from "../components/Landingpage/Footer";
// import Services from "../components/Landingpage/Services";
// import Testimonials from "../components/Landingpage/Testimonials";
// import CTA from "../components/Landingpage/CTA";
// import HowItWorks from "../components/Landingpage/HowItWorks";  
import AboutUsSection from "../components/Landingpage/AboutUsSection";
// import JobCard from "../components/Landingpage/JobCard";
import CategoriesSection from "../components/Landingpage/CategoriesSection";
import TopCompaniesSection from "../components/Landingpage/TopCompaniesSection";
import Navbar from "../components/Landingpage/Navbar";
import CallToActionSection from "../components/Landingpage/CallToActionSection";
import Testimonials from "../components/Landingpage/Testimonials";
const LandingPage = () => (
  <>
  <Navbar />
    {/* <Header /> */}
    <main>
      <Hero />
      <AboutUsSection />
      <FeaturedJobs />
      <CategoriesSection />
      <TopCompaniesSection />
      <Testimonials />
      <CallToActionSection />
      {/* You’ll later add Services, Testimonials, CTA, HowItWorks */}
    </main>
    <Footer />
  </>
);

export default LandingPage;
