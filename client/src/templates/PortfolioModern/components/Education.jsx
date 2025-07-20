import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Education = ({ data }) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };
  
  // Card hover animation variants
  const cardHoverVariants = {
    rest: { 
      scale: 1,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      y: 0
    },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      y: -10,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };
  
  // Education icon animation variants
  const iconVariants = {
    rest: { rotate: 0 },
    hover: { rotate: 15, transition: { duration: 0.3, ease: 'easeInOut' } }
  };

  // Process education data
  // Robustly process education data to handle both array and string formats
  const processEducation = () => {
    const eduData = data && data.education ? data.education : null;
    if (!eduData) return [];

    // If education is an array
    if (Array.isArray(eduData)) {
      return eduData.flatMap(edu => {
        // Category with entries
        if (edu && typeof edu === 'object' && edu.category && Array.isArray(edu.entries)) {
          return edu.entries.map(entry => ({
            category: edu.category,
            degree: entry.degree || '',
            institution: entry.institution || '',
            date: entry.date || '',
            description: entry.description || ''
          }));
        }
        // Simple education object
        if (edu && typeof edu === 'object') {
          return [{
            category: edu.category || 'Education',
            degree: edu.degree || '',
            institution: edu.institution || '',
            date: edu.date || '',
            description: edu.description || ''
          }];
        }
        // String format (legacy)
        if (typeof edu === 'string') {
          const lines = edu.split('\n');
          const degree = lines[0] || '';
          let institution = '';
          let date = '';
          if (lines.length > 1) {
            const datePattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current|ongoing)/i;
            const dateMatch = lines[1].match(datePattern);
            if (dateMatch) {
              date = lines[1].trim();
              institution = lines.length > 2 ? lines[2].trim() : '';
            } else {
              institution = lines[1].trim();
              date = lines.length > 2 ? lines[2].trim() : '';
            }
          }
          const description = lines.slice(Math.min(3, lines.length)).join('\n');
          return [{
            category: 'Education',
            degree,
            institution,
            date,
            description,
          }];
        }
        return [];
      });
    }

    // If education is a string (legacy)
    if (typeof eduData === 'string') {
      return eduData.split('\n\n').map(edu => {
        const lines = edu.split('\n');
        const degree = lines[0] || '';
        let institution = '';
        let date = '';
        if (lines.length > 1) {
          const datePattern = /(\d{4})\s*[-–—]\s*(\d{4}|present|current|ongoing)/i;
          const dateMatch = lines[1].match(datePattern);
          if (dateMatch) {
            date = lines[1].trim();
            institution = lines.length > 2 ? lines[2].trim() : '';
          } else {
            institution = lines[1].trim();
            date = lines.length > 2 ? lines[2].trim() : '';
          }
        }
        const description = lines.slice(Math.min(3, lines.length)).join('\n');
        return {
          category: 'Education',
          degree,
          institution,
          date,
          description,
        };
      });
    }
    return [];
  };

  const educationEntries = processEducation();

  return (
    <section className="py-16 px-2 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 w-full overflow-x-hidden" id="education">
      <div className="max-w-6xl mx-auto w-full">
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
              <span className="text-indigo-600 dark:text-indigo-400">Education</span> 
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              My academic background and educational journey
            </p>
          </motion.div>
          
          {educationEntries.length > 0 ? (
            <motion.div 
              className="space-y-12"
              variants={containerVariants}
            >
              {/* Group education entries by category */}
              {Object.entries(educationEntries.reduce((acc, edu) => {
                const category = edu.category || 'Education';
                if (!acc[category]) acc[category] = [];
                acc[category].push(edu);
                return acc;
              }, {})).map(([category, entries], categoryIndex) => (
                <motion.div key={categoryIndex} variants={itemVariants}>
                  <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                    {category}
                  </h3>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {entries.map((edu, index) => {
                      // Determine education level icon
                      let educationIcon = '🎓'; // Default graduation cap
                      const degreeLower = edu.degree.toLowerCase();
                      
                      if (degreeLower.includes('phd') || degreeLower.includes('doctor')) {
                        educationIcon = '🔬';
                      } else if (degreeLower.includes('master') || degreeLower.includes('mba') || degreeLower.includes('ms') || degreeLower.includes('ma')) {
                        educationIcon = '📚';
                      } else if (degreeLower.includes('bachelor') || degreeLower.includes('bs') || degreeLower.includes('ba') || degreeLower.includes('btech')) {
                        educationIcon = '🎓';
                      } else if (degreeLower.includes('diploma') || degreeLower.includes('certificate')) {
                        educationIcon = '📜';
                      } else if (degreeLower.includes('high school') || degreeLower.includes('secondary')) {
                        educationIcon = '🏫';
                      } else if (category.toLowerCase().includes('certification')) {
                        educationIcon = '🏆';
                      } else if (category.toLowerCase().includes('course')) {
                        educationIcon = '📖';
                      }
                      
                      return (
                        <motion.div
                          key={`${categoryIndex}-${index}`}
                          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
                          initial="rest"
                          whileHover="hover"
                          animate="rest"
                          variants={cardHoverVariants}
                        >
                          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <motion.div 
                                    className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-2xl"
                                    variants={iconVariants}
                                  >
                                    {educationIcon}
                                  </motion.div>
                                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{edu.degree}</h3>
                                </div>
                                {edu.institution && (
                                  <p className="text-indigo-600 dark:text-indigo-400 font-medium ml-13">{edu.institution}</p>
                                )}
                              </div>
                              {edu.date && (
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium whitespace-nowrap">
                                  {edu.date}
                                </span>
                              )}
                            </div>
                            
                            {edu.description && (
                              <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                                  {edu.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12 text-gray-500 dark:text-gray-400"
              variants={itemVariants}
            >
              No education entries to display yet.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Education;