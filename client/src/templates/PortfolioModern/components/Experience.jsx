import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Experience = ({ data }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Process experience data
  const processExperience = () => {
    if (!data.experience) return [];
    // If experience is an array of objects or cards
    if (Array.isArray(data.experience)) {
      return data.experience.flatMap(exp => {
        if (exp && typeof exp === 'object' && exp.role) {
          return [{
            role: exp.role || '',
            company: exp.company || '',
            date: exp.date || '',
            description: exp.description || ''
          }];
        }
        // If it's a string, parse as legacy
        if (typeof exp === 'string') {
          const lines = exp.split('\n');
          const title = lines[0] || '';
          const date = lines.length > 1 ? lines[1] : '';
          const description = lines.slice(2).join('\n');
          const companyMatch = title.match(/at\s+([^,]+)/i) || title.match(/\-\s*([^,]+)/i);
          const company = companyMatch ? companyMatch[1].trim() : '';
          const roleMatch = title.match(/^([^-|at]+)/i);
          const role = roleMatch ? roleMatch[0].trim() : title;
          return [{ role, company, date, description }];
        }
        return [];
      });
    }
    // If experience is a string, parse it
    if (typeof data.experience === 'string') {
      return data.experience.split('\n\n').map(exp => {
        const lines = exp.split('\n');
        const title = lines[0] || '';
        const date = lines.length > 1 ? lines[1] : '';
        const description = lines.slice(2).join('\n');
        const companyMatch = title.match(/at\s+([^,]+)/i) || title.match(/\-\s*([^,]+)/i);
        const company = companyMatch ? companyMatch[1].trim() : '';
        const roleMatch = title.match(/^([^-|at]+)/i);
        const role = roleMatch ? roleMatch[0].trim() : title;
        return { role, company, date, description };
      });
    }
    return [];
  };

  const experiences = processExperience();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 " id="experience">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div 
            className="text-center mb-12"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white inline-flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400">Work</span> Experience
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              My professional journey and career highlights
            </p>
          </motion.div>
          
          {experiences.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-indigo-200 dark:bg-indigo-800 transform md:translate-x-px"></div>
              
              <motion.div 
                className="space-y-12"
                variants={containerVariants}
              >
                {experiences.map((exp, index) => (
                  <motion.div 
                    key={index}
                    className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                    variants={itemVariants}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-0 md:left-1/2 top-6 w-4 h-4 rounded-full bg-indigo-500 transform -translate-x-1/2 md:-translate-x-2 z-10"></div>
                    
                    {/* Date - mobile: above content, desktop: in middle */}
                    <div className="md:w-1/2 md:text-right md:pr-8 pl-6 md:pl-0">
                      <div className={`inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg font-medium ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                        {exp.date}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-1/2 md:pl-8 pl-6">
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                        {exp.company && (
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">{exp.company}</p>
                        )}
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-justify">{exp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ) : (
            <motion.div 
              className="text-center py-12 text-gray-500 dark:text-gray-400"
              variants={itemVariants}
            >
              No experience entries to display yet.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;