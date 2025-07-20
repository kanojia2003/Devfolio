import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants for different sections
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInLeft = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeInRight = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const skillItem = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

// Animated Section component that triggers animations when in view
const AnimatedSection = ({ children, variants, className }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default function TemplateModern({ data }) {
  // Group skills by category
  const groupedSkills = Array.isArray(data.skills) && data.skills[0]?.category
    ? data.skills
    : [
        {
          category: "Skills",
          items: Array.isArray(data.skills) ? data.skills : []
        }
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white font-sans">
      {/* Hero Section with Parallax Effect */}
      <motion.header 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-10"></div>
          <div className="absolute inset-0 bg-slate-900 opacity-60"></div>
        </motion.div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-purple-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {data.name}
          </motion.h1>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-8">{data.email} • {data.phone}</p>
            
            <div className="flex justify-center space-x-6">
              {data.linkedin && (
                <motion.a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-full transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </motion.a>
              )}
              
              {data.github && (
                <motion.a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-800 rounded-full transition-all duration-300 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </motion.a>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 1.5, delay: 1, repeat: Infinity, repeatType: "loop" }}
          >
            <svg className="w-8 h-8 text-white animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-16 space-y-32">
        {/* About/Summary Section */}
        {data.summary && (
          <AnimatedSection variants={fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-xl leading-relaxed text-gray-300 whitespace-pre-line">
              {data.summary}
            </p>
          </AnimatedSection>
        )}

        {/* Skills Section with Grid Layout */}
        <AnimatedSection variants={staggerContainer} className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          
          <div className="space-y-12">
            {groupedSkills.map((skillGroup, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <h3 className="text-xl font-semibold text-purple-300">{skillGroup.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {skillGroup.items.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={skillItem}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg shadow-lg hover:shadow-purple-900/20 transition-all duration-300"
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <p className="text-center font-medium">{skill}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Experience Section with Timeline */}
        {data.experience && (
          <AnimatedSection variants={fadeInLeft} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Experience
            </h2>
            
            <div className="relative border-l-2 border-purple-600 pl-8 ml-4 space-y-10">
              {data.experience.split('\n\n').map((exp, idx) => {
                const lines = exp.split('\n');
                const title = lines[0];
                const date = lines[1];
                const details = lines.slice(2).join('\n');
                
                return (
                  <motion.div 
                    key={idx}
                    className="relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="absolute -left-12 mt-1.5 h-6 w-6 rounded-full border-2 border-purple-600 bg-gray-900"></div>
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <p className="text-purple-300 mb-2">{date}</p>
                    <p className="text-gray-300 whitespace-pre-line">{details}</p>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* Education Section */}
        {data.education && (
          <AnimatedSection variants={fadeInRight} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Education
            </h2>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl">
              <div className="whitespace-pre-line text-gray-300 text-lg leading-relaxed">
                {data.education}
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Projects Section with Cards */}
        {data.projects && (
          <AnimatedSection variants={staggerContainer} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Projects
            </h2>
            
            <div className="space-y-8">
              {data.projects.split('\n\n').map((project, idx) => {
                const lines = project.split('\n');
                const title = lines[0];
                const details = lines.slice(1).join('\n');
                
                return (
                  <motion.div 
                    key={idx}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl hover:shadow-purple-900/20 transition-all duration-300"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                      <p className="text-gray-300 whitespace-pre-line">{details}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatedSection>
        )}

        {/* Other Information Section */}
        {data.others && (
          <AnimatedSection variants={fadeInUp} className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Additional Information
            </h2>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 shadow-xl">
              <div className="whitespace-pre-line text-gray-300 text-lg leading-relaxed">
                {data.others}
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>

      {/* Footer with Contact */}
      <footer className="bg-slate-900 py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-6 inline-block bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Get In Touch
            </h2>
            <p className="text-gray-400 mb-6">Feel free to reach out for collaborations or just a friendly hello</p>
            
            <div className="flex justify-center space-x-4">
              <motion.a 
                href={`mailto:${data.email}`}
                className="text-white hover:text-purple-300 transition-colors duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                </svg>
              </motion.a>
              
              {data.linkedin && (
                <motion.a 
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </motion.a>
              )}
              
              {data.github && (
                <motion.a 
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-purple-300 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              )}
            </div>
            
            <p className="mt-8 text-gray-500 text-sm">
              © {new Date().getFullYear()} {data.name} • Built with Devfolio
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}