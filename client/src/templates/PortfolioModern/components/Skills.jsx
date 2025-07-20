import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../../../firebase';

// SVG icon mapping for technologies across different categories
const skillIcons = {
  // Languages
  'c': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" alt="C" style={{height:32}} />,
  'c++': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" alt="C++" style={{height:32}} />,
  'c#': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" alt="C#" style={{height:32}} />,
  'python': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" style={{height:32}} />,
  'javascript': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" style={{height:32}} />,
  'typescript': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" style={{height:32}} />,
  'java': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java" style={{height:32}} />,
  'php': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP" style={{height:32}} />,
  'ruby': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg" alt="Ruby" style={{height:32}} />,
  'go': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg" alt="Go" style={{height:32}} />,
  'rust': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg" alt="Rust" style={{height:32}} />,
  'swift': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg" alt="Swift" style={{height:32}} />,
  'kotlin': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg" alt="Kotlin" style={{height:32}} />,
  'scala': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg" alt="Scala" style={{height:32}} />,
  'r': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg" alt="R" style={{height:32}} />,
  
  // Frontend
  'html': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML" style={{height:32}} />,
  'html5': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5" style={{height:32}} />,
  'css': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS" style={{height:32}} />,
  'css3': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3" style={{height:32}} />,
  'sass': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg" alt="Sass" style={{height:32}} />,
  'less': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/less/less-plain-wordmark.svg" alt="Less" style={{height:32}} />,
  'bootstrap': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" style={{height:32}} />,
  'tailwind': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind" style={{height:32}} />,
  'tailwind css': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" alt="Tailwind CSS" style={{height:32}} />,
  'material ui': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="Material UI" style={{height:32}} />,
  'mui': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" alt="MUI" style={{height:32}} />,
  'react': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" style={{height:32}} />,
  'react.js': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React.js" style={{height:32}} />,
  'reactjs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="ReactJS" style={{height:32}} />,
  'vue': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="Vue" style={{height:32}} />,
  'vue.js': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="Vue.js" style={{height:32}} />,
  'vuejs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg" alt="VueJS" style={{height:32}} />,
  'angular': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" alt="Angular" style={{height:32}} />,
  'svelte': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg" alt="Svelte" style={{height:32}} />,
  'next.js': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg" alt="Next.js" style={{height:32,background:'#fff',borderRadius:4}} />,
  'nextjs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original-wordmark.svg" alt="NextJS" style={{height:32,background:'#fff',borderRadius:4}} />,
  'gatsby': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gatsby/gatsby-original.svg" alt="Gatsby" style={{height:32}} />,
  'jquery': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg" alt="jQuery" style={{height:32}} />,
  'redux': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" alt="Redux" style={{height:32}} />,
  
  // Backend
  'node.js': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" style={{height:32}} />,
  'nodejs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="NodeJS" style={{height:32}} />,
  'express': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express" style={{height:32,background:'#fff',borderRadius:4}} />,
  'express.js': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" style={{height:32,background:'#fff',borderRadius:4}} />,
  'expressjs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="ExpressJS" style={{height:32,background:'#fff',borderRadius:4}} />,
  'django': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg" alt="Django" style={{height:32}} />,
  'flask': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg" alt="Flask" style={{height:32}} />,
  'fastapi': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" alt="FastAPI" style={{height:32}} />,
  'spring': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring" style={{height:32}} />,
  'spring boot': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot" style={{height:32}} />,
  'laravel': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg" alt="Laravel" style={{height:32}} />,
  'rails': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg" alt="Rails" style={{height:32}} />,
  'ruby on rails': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg" alt="Ruby on Rails" style={{height:32}} />,
  'nestjs': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg" alt="NestJS" style={{height:32}} />,
  'graphql': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" alt="GraphQL" style={{height:32}} />,
  'apollo': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" alt="Apollo" style={{height:32}} />,
  'rest api': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="REST API" style={{height:32}} />,
  'restful api': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="RESTful API" style={{height:32}} />,
  
  // Databases
  'mongodb': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" style={{height:32}} />,
  'mysql': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL" style={{height:32}} />,
  'sql': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="SQL" style={{height:32}} />,
  'postgresql': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" style={{height:32}} />,
  'postgres': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="Postgres" style={{height:32}} />,
  'sqlite': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" style={{height:32}} />,
  'redis': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" style={{height:32}} />,
  'firebase': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" alt="Firebase" style={{height:32}} />,
  'oracle': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" alt="Oracle" style={{height:32}} />,
  'dynamodb': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" alt="DynamoDB" style={{height:32}} />,
  'cassandra': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" alt="Cassandra" style={{height:32}} />,
  
  // DevOps & Tools
  'git': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" style={{height:32}} />,
  'github': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" style={{height:32}} />,
  'gitlab': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg" alt="GitLab" style={{height:32}} />,
  'bitbucket': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bitbucket/bitbucket-original.svg" alt="Bitbucket" style={{height:32}} />,
  'docker': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" style={{height:32}} />,
  'kubernetes': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" alt="Kubernetes" style={{height:32}} />,
  'jenkins': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg" alt="Jenkins" style={{height:32}} />,
  'travis': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/travis/travis-plain.svg" alt="Travis" style={{height:32}} />,
  'circleci': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/circleci/circleci-plain.svg" alt="CircleCI" style={{height:32}} />,
  'aws': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg" alt="AWS" style={{height:32}} />,
  'azure': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" style={{height:32}} />,
  'gcp': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg" alt="GCP" style={{height:32}} />,
  'heroku': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/heroku/heroku-original.svg" alt="Heroku" style={{height:32}} />,
  'netlify': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Netlify" style={{height:32}} />,
  'vercel': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" alt="Vercel" style={{height:32}} />,
  'nginx': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" alt="Nginx" style={{height:32}} />,
  'apache': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg" alt="Apache" style={{height:32}} />,
  'linux': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" alt="Linux" style={{height:32}} />,
  'ubuntu': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg" alt="Ubuntu" style={{height:32}} />,
  'bash': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" alt="Bash" style={{height:32}} />,
  'powershell': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" alt="PowerShell" style={{height:32}} />,
  'vs code': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VS Code" style={{height:32}} />,
  'vscode': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" alt="VSCode" style={{height:32}} />,
  'visual studio': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg" alt="Visual Studio" style={{height:32}} />,
  'intellij': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg" alt="IntelliJ" style={{height:32}} />,
  'pycharm': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg" alt="PyCharm" style={{height:32}} />,
  'webstorm': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webstorm/webstorm-original.svg" alt="WebStorm" style={{height:32}} />,
  'postman': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" alt="Postman" style={{height:32}} />,
  'jira': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" alt="Jira" style={{height:32}} />,
  'confluence': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/confluence/confluence-original.svg" alt="Confluence" style={{height:32}} />,
  'figma': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" style={{height:32}} />,
  'sketch': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sketch/sketch-original.svg" alt="Sketch" style={{height:32}} />,
  'adobe xd': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg" alt="Adobe XD" style={{height:32}} />,
  'photoshop': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" alt="Photoshop" style={{height:32}} />,
  'illustrator': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" alt="Illustrator" style={{height:32}} />,
  
  // Mobile
  'android': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg" alt="Android" style={{height:32}} />,
  'ios': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg" alt="iOS" style={{height:32}} />,
  'react native': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" style={{height:32}} />,
  'flutter': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg" alt="Flutter" style={{height:32}} />,
  'ionic': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ionic/ionic-original.svg" alt="Ionic" style={{height:32}} />,
  'xamarin': <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xamarin/xamarin-original.svg" alt="Xamarin" style={{height:32}} />,
  
  // Default icon for unknown skills
  'default': <span style={{fontSize:'2rem'}}>💡</span>
};

const getSkillIcon = (skill) => {
  const key = skill.toLowerCase();
  return skillIcons[key] || skillIcons['default'];
};

const SkillCard = ({ category, items }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 bg-opacity-90 shadow-lg backdrop-blur-md min-w-[220px] max-w-[340px] text-center flex flex-col items-center gap-5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <h3 className="mb-3 font-bold text-lg text-gray-900 dark:text-white tracking-wide">{category}</h3>
    <div className="grid grid-cols-2 gap-x-6 gap-y-6 w-full justify-items-center">
      {items.map((skill, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center gap-2 min-w-[90px] mb-2"
          title={skill}
        >
          <span className="block" style={{height: '48px', width: '48px'}}>{React.cloneElement(getSkillIcon(skill), {style: {height: 48, width: 48}})}</span>
          <span className="text-lg font-semibold mt-1 text-gray-700 dark:text-gray-300">{skill}</span>
        </div>
      ))}
    </div>
  </div>
);

const Skills = () => {
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process skills data based on format
        if (Array.isArray(res.data.skills)) {
          // Check if skills are already categorized
          const categorizedSkills = [];
          let hasUncategorizedSkills = false;
          
          // Process each skill item
          for (const skill of res.data.skills) {
            // If it's a category object
            if (skill && typeof skill === 'object' && skill.category && Array.isArray(skill.items)) {
              categorizedSkills.push({
                category: skill.category,
                items: skill.items
              });
            } 
            // If it's a string (uncategorized skill)
            else if (typeof skill === 'string') {
              hasUncategorizedSkills = true;
              
              // Find or create "Other Skills" category
              let otherCategory = categorizedSkills.find(cat => cat.category === "Other Skills");
              if (!otherCategory) {
                otherCategory = { category: "Other Skills", items: [] };
                categorizedSkills.push(otherCategory);
              }
              
              otherCategory.items.push(skill);
            }
          }
          
          // If we have categorized skills, use them
          if (categorizedSkills.length > 0) {
            setSkillsData(categorizedSkills);
          } else {
            setSkillsData([]);
          }
        } else {
          setSkillsData([]);
        }
      } catch (err) {
        setSkillsData([]);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 ">
      <h2 className="text-center mb-8 font-bold text-3xl text-gray-900 dark:text-white tracking-wide">Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {skillsData.map((group, idx) => (
          <SkillCard key={idx} category={group.category} items={group.items} />
        ))}
      </div>
    </section>
  );
};

export default Skills;