import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Projects = ({ data }) => {
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Process projects data
  const processProjects = () => {
    if (!data.projects) return [];
    
    // If projects is already an array of objects, return it
    if (Array.isArray(data.projects) && typeof data.projects[0] === 'object') {
      return data.projects;
    }
    
    // If projects is a string, parse it
    if (typeof data.projects === 'string') {
      // Check if the string contains project formatting (e.g., "Project 1: Title | Description | GitHub Link | Live Link")
      const hasFormatting = /Project\s+\d+:|\|\s*https?:\/\//im.test(data.projects);
      
      let projectsArray = [];
      
      if (hasFormatting) {
        // Split by project pattern
        projectsArray = data.projects.split(/(?=^Project\s+\d+:|^\d+\.\s|^#\d+\s)/m);
        // Remove any empty entries
        projectsArray = projectsArray.filter(p => p.trim().length > 0);
      } else {
        // Use the standard double newline splitting
        projectsArray = data.projects.split('\n\n');
      }
      
      return projectsArray.map(project => {
        // Check if the entire project entry contains the pipe format
        if (project.includes('|')) {
          const lines = project.split('\n');
          // Process the first line which should contain the pipe-separated values
          const firstLine = lines[0].replace(/^(\d+\.\s|Project\s+\d+:|#\d+\s)/i, '').trim();
          
          if (firstLine.includes('|')) {
            const parts = firstLine.split('|').map(part => part.trim());
            return {
              title: parts[0] || '',
              description: parts[1] || '',
              github: parts[2] || null,
              demo: parts[3] || null,
              technologies: [],
            };
          }
        }
        
        // If not in pipe format, process the traditional way
        const lines = project.split('\n');
        // Remove any project numbering from the title line
        const titleLine = lines[0].replace(/^(\d+\.\s|Project\s+\d+:|#\d+\s)/i, '').trim();
        const description = lines.slice(1).join('\n');
        
        // Try to extract GitHub, demo/live links, and technologies from description
        const githubMatch = description.match(/github(\s+link)?:\s*(https?:\/\/[^\s]+)/i);
        const demoMatch = description.match(/demo(\s+link)?:\s*(https?:\/\/[^\s]+)/i) || 
                          description.match(/live(\s+link)?:\s*(https?:\/\/[^\s]+)/i) ||
                          description.match(/project(\s+link)?:\s*(https?:\/\/[^\s]+)/i);
        const techMatch = description.match(/tech(nologies|\s+stack)?:\s*([^\n]+)/i);
        
        return {
          title: titleLine,
          description: description
            .replace(/github(\s+link)?:\s*(https?:\/\/[^\s]+)/i, '')
            .replace(/demo(\s+link)?:\s*(https?:\/\/[^\s]+)/i, '')
            .replace(/live(\s+link)?:\s*(https?:\/\/[^\s]+)/i, '')
            .replace(/project(\s+link)?:\s*(https?:\/\/[^\s]+)/i, '')
            .replace(/tech(nologies|\s+stack)?:\s*([^\n]+)/i, '')
            .trim(),
          github: githubMatch ? githubMatch[2] : null,
          demo: demoMatch ? demoMatch[2] : null,
          technologies: techMatch ? techMatch[2].split(',').map(tech => tech.trim()) : [],
        };
      });
    }
    
    return [];
  };

  const projects = processProjects();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900" id="projects">
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
              <span className="text-indigo-600 dark:text-indigo-400">Featured</span> Projects
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              A showcase of my recent work and personal projects
            </p>
          </motion.div>
          
          <motion.div 
            className={`grid gap-8 ${projects.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : projects.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} w-full`}
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg h-full flex flex-col transform transition-all duration-300"
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                {/* Project image or placeholder */}
                <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-4xl font-bold">{project.title.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Project number badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-md">
                    #{index + 1}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{project.title}</h3>
                  
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech, techIdx) => (
                        <span 
                          key={techIdx}
                          className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 flex-1">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {project.github && (
                      <a 
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md flex items-center gap-2 text-sm transition-all duration-300 hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        View Code
                      </a>
                    )}
                    
                    {project.demo && (
                      <a 
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md flex items-center gap-2 text-sm transition-all duration-300 hover:shadow-md"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        Visit Project
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          {projects.length === 0 && (
            <motion.div 
              className="text-center py-12 text-gray-500 dark:text-gray-400"
              variants={itemVariants}
            >
              No projects to display yet.
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;