import React from 'react';
import { motion } from 'framer-motion';

// Import components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Import theme provider for dark/light mode
import { ThemeProvider } from './context/ThemeContext';

const PortfolioModern = ({ data }) => {
  return (
    <ThemeProvider>
      <div className="font-sans overflow-x-hidden max-w-[100vw] flex flex-col min-h-screen">
        <Navbar data={data} />
        <main className="flex-grow flex flex-col">
          <div id="hero" className="w-full">
            <Hero data={data} />
          </div>
          <div id="about" className="w-full">
            <About data={data} />
          </div>
          <div id="skills" className="w-full">
            <Skills data={data} />
          </div>
          <div id="projects" className="w-full">
            <Projects data={data} />
          </div>
          <div id="experience" className="w-full">
            <Experience data={data} />
          </div>
          <div id="education" className="w-full">
            <Education data={data} />
          </div>
          <div id="contact" className="w-full">
            <Contact data={data} />
          </div>
        </main>
        <Footer data={data} />
      </div>
    </ThemeProvider>
  );
};

export default PortfolioModern;