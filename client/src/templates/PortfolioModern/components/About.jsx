import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const About = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Extract education info for "Currently pursuing" text
  const currentEducation = (data.education && typeof data.education === 'string') ? 
    data.education.split('\n').find(line => line.toLowerCase().includes('pursuing') || line.toLowerCase().includes('current')) : 
    null;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 overflow-hidden" id="about">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-12 items-center w-full"
        >
          {/* Image or avatar */}
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="aspect-square overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-1">
              {data.profileImage ? (
                <img 
                  src={data.profileImage} 
                  alt={data.name} 
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                  <span className="text-7xl text-white">{data.name ? data.name.charAt(0) : 'A'}</span>
                </div>
              )}
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 dark:bg-yellow-600 rounded-lg -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.6, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            />
            <motion.div 
              className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 dark:bg-blue-700 rounded-full -z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </motion.div>
          
          {/* About text content */}
          <motion.div variants={containerVariants}>
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2"
            >
              <span className="text-indigo-600 dark:text-indigo-400">About</span> Me
            </motion.h2>
            
            <motion.div 
              variants={itemVariants}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
                🚀 {data.summary || 'Passionate about building beautiful, functional web applications.'}
              </p>
              
              {currentEducation && (
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  🎓 {currentEducation}
                </p>
              )}
              
              {/* Additional about content */}
              {data.about && (
                <div className="mt-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                  {data.about}
                </div>
              )}
            </motion.div>
            
            {/* Call to action */}
            <motion.div 
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-4"
            >
              <a 
                href="#contact" 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                Get in Touch
              </a>
              
              {data.resumeUrl && (
                <a 
                  href={data.resumeUrl} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                >
                  Download Resume
                </a>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;