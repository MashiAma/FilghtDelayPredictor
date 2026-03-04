// src/pages/LandingPage/LandingPage.jsx
import React from "react";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import CTA from "./sections/CTA";
import AppHeader from "../../components/AppHeader";
import PageTransition from "../../assets/animations/Pagetransition";
import Footer from "../../components/Footer";
import { FaHeartbeat, FaStethoscope, FaChartLine } from "react-icons/fa";

const LandingPage = () => {
  return (
    <PageTransition>
      <AppHeader />
      <Hero />
      <Features />
      {/* <HowItWorks /> */}
      <CTA />
      <Footer />
    </PageTransition>
  );
};

export default LandingPage;
