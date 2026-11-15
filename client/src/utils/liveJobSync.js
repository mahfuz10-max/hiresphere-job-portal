import axios from 'axios';
import { SERVER_BASE_URL } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${SERVER_BASE_URL}/api`;

const RAW_DEMO_JOBS = [
  {
    "id": "demo-se-1",
    "title": "Full-Stack MERN Developer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 55000,
    "salaryMax": 85000,
    "vacancies": 3,
    "daysToDeadline": 28,
    "description": "Build and scale enterprise SaaS modules, RESTful services, and responsive React dashboards for clients across South Asia.",
    "requirements": "\u2022 Strong proficiency in React.js, Node.js, Express.js, and MongoDB\n\u2022 Experience with JWT authentication, RBAC, and Tailwind CSS\n\u2022 Familiarity with Git workflow and REST API design"
  },
  {
    "id": "demo-se-2",
    "title": "Frontend React.js Engineer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 45000,
    "salaryMax": 70000,
    "vacancies": 2,
    "daysToDeadline": 24,
    "description": "Craft fast, accessible, and responsive web interfaces using React 18, Vite, and Tailwind CSS.",
    "requirements": "\u2022 1+ year experience with React hooks, context, and React Router v6\n\u2022 Strong command of modern ES6+ JavaScript and responsive CSS\n\u2022 Eye for typography, spacing, and visual polish"
  },
  {
    "id": "demo-se-3",
    "title": "Next.js & TypeScript Frontend Developer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 60000,
    "salaryMax": 90000,
    "vacancies": 3,
    "daysToDeadline": 32,
    "description": "Build high-performance SSR web applications, interactive client portals, and reusable UI design systems using Next.js 14 and TypeScript.",
    "requirements": "\u2022 1-3 years experience with React.js, Next.js, and TypeScript\n\u2022 Strong understanding of responsive mobile-first layouts and Core Web Vitals\n\u2022 Experience integrating RESTful APIs"
  },
  {
    "id": "demo-se-4",
    "title": "Backend Node.js & Microservices Engineer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 65000,
    "salaryMax": 100000,
    "vacancies": 3,
    "daysToDeadline": 25,
    "description": "Architect high-throughput payment settlement APIs, webhook processors, and MongoDB/PostgreSQL data pipelines.",
    "requirements": "\u2022 2+ years in Node.js, Express.js, and database indexing\n\u2022 Strong understanding of transactional integrity and JWT/OAuth2 security"
  },
  {
    "id": "demo-se-5",
    "title": "Junior Web Developer Intern",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Internship",
    "salaryMin": 15000,
    "salaryMax": 22000,
    "vacancies": 5,
    "daysToDeadline": 30,
    "description": "Hands-on 4-month paid internship for final-year CSE undergraduates eager to work on production React and Express projects.",
    "requirements": "\u2022 Pursuing B.Sc. in CSE/CS or recent graduate\n\u2022 Solid foundation in HTML5, CSS3, JavaScript, and React basics\n\u2022 Eagerness to learn code review and agile workflows"
  },
  {
    "id": "demo-se-6",
    "title": "Python Django Backend Developer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 50000,
    "salaryMax": 80000,
    "vacancies": 2,
    "daysToDeadline": 26,
    "description": "Design and maintain secure backend microservices, scheduled data pipelines, and third-party payment integrations.",
    "requirements": "\u2022 1+ year experience with Python, Django REST Framework, and PostgreSQL\n\u2022 Familiarity with Celery, Redis caching, and Docker containers"
  },
  {
    "id": "demo-se-7",
    "title": "Flutter Cross-Platform App Developer",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 52000,
    "salaryMax": 82000,
    "vacancies": 2,
    "daysToDeadline": 30,
    "description": "Create fluid Android and iOS mobile applications with clean animations, push notifications, and offline data synchronization.",
    "requirements": "\u2022 Hands-on experience with Flutter, Dart, and state management (Bloc/Riverpod)\n\u2022 Experience publishing apps to Google Play Store or App Store"
  },
  {
    "id": "demo-se-8",
    "title": "React Native Mobile App Developer",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Sylhet",
    "category": "Software Engineering",
    "jobType": "Contract",
    "salaryMin": 50000,
    "salaryMax": 80000,
    "vacancies": 2,
    "daysToDeadline": 23,
    "description": "Build smooth cross-platform iOS and Android companion apps integrated with RESTful APIs.",
    "requirements": "\u2022 Experience with React / React Native, state management, and REST API integration\n\u2022 Focus on smooth animations and offline resilience"
  },
  {
    "id": "demo-se-9",
    "title": "Full-Stack JavaScript Engineer (Remote)",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Remote",
    "category": "Software Engineering",
    "jobType": "Remote",
    "salaryMin": 60000,
    "salaryMax": 92000,
    "vacancies": 2,
    "daysToDeadline": 31,
    "description": "Develop end-to-end SaaS features from MongoDB schemas and Express controllers to polished React views.",
    "requirements": "\u2022 Strong knowledge of MERN stack and modern ES6+ JavaScript\n\u2022 Self-motivated team player comfortable in remote workflows"
  },
  {
    "id": "demo-se-10",
    "title": "Junior Node.js & MongoDB API Developer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Rajshahi",
    "category": "Software Engineering",
    "jobType": "Full-time",
    "salaryMin": 35000,
    "salaryMax": 52000,
    "vacancies": 3,
    "daysToDeadline": 31,
    "description": "Collaborate with senior backend architects to build RESTful endpoints, Mongoose aggregation pipelines, and RBAC modules.",
    "requirements": "\u2022 Strong fundamentals in JavaScript (ES6+), Node.js, Express.js, and MongoDB\n\u2022 Familiarity with JWT authentication, Postman, and Git"
  },
  {
    "id": "demo-cs-1",
    "title": "Cybersecurity & Penetration Testing Analyst",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Remote",
    "category": "Cybersecurity",
    "jobType": "Full-time",
    "salaryMin": 60000,
    "salaryMax": 95000,
    "vacancies": 2,
    "daysToDeadline": 28,
    "description": "Perform vulnerability assessments, OWASP Top 10 security audits, and API security hardening across web applications.",
    "requirements": "\u2022 Knowledge of web application security, Burp Suite, and OWASP standards\n\u2022 Certification or training in Penetration Testing (e.g., C)PTE, CEH) is a plus"
  },
  {
    "id": "demo-cs-2",
    "title": "SOC Analyst & Incident Responder (Level 1)",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Cybersecurity",
    "jobType": "Full-time",
    "salaryMin": 48000,
    "salaryMax": 75000,
    "vacancies": 2,
    "daysToDeadline": 28,
    "description": "Monitor enterprise SIEM dashboards, investigate security alerts, triage phishing attempts, and assist in vulnerability remediation.",
    "requirements": "\u2022 Solid grasp of TCP/IP networking, Linux, OWASP Top 10, and SIEM tools (Splunk/Wazuh)\n\u2022 Cybersecurity training or certification preferred"
  },
  {
    "id": "demo-cs-3",
    "title": "Information Security & Compliance Officer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Cybersecurity",
    "jobType": "Full-time",
    "salaryMin": 70000,
    "salaryMax": 105000,
    "vacancies": 1,
    "daysToDeadline": 27,
    "description": "Oversee PCI-DSS compliance, access control audits, and incident response readiness for digital banking products.",
    "requirements": "\u2022 Solid understanding of network security, encryption, and access control\n\u2022 Experience auditing cloud and web infrastructure"
  },
  {
    "id": "demo-cs-4",
    "title": "Application Security (AppSec) Engineer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Cybersecurity",
    "jobType": "Full-time",
    "salaryMin": 68000,
    "salaryMax": 102000,
    "vacancies": 2,
    "daysToDeadline": 33,
    "description": "Embed automated SAST/DAST security scanning into CI/CD pipelines, review authentication code, and lead threat modeling.",
    "requirements": "\u2022 Strong understanding of Node.js/React security, JWT hardening, and OWASP ASVS\n\u2022 Hands-on experience with Snyk, SonarQube, and Burp Suite Pro"
  },
  {
    "id": "demo-cs-5",
    "title": "Junior Ethical Hacking & Red Team Intern",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Cybersecurity",
    "jobType": "Internship",
    "salaryMin": 16000,
    "salaryMax": 24000,
    "vacancies": 4,
    "daysToDeadline": 29,
    "description": "Assist senior penetration testers in reconnaissance, web vulnerability discovery, CTF research, and security audit reporting.",
    "requirements": "\u2022 CSE undergraduate with hands-on ethical hacking lab training (C)PTE / TryHackMe / HackTheBox)\n\u2022 Familiarity with Kali Linux, Nmap, Wireshark, and Burp Suite"
  },
  {
    "id": "demo-cs-6",
    "title": "Cloud & Network Security Specialist",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Remote",
    "category": "Cybersecurity",
    "jobType": "Contract",
    "salaryMin": 65000,
    "salaryMax": 95000,
    "vacancies": 1,
    "daysToDeadline": 25,
    "description": "Secure AWS VPC architectures, configure WAF rules, zero-trust IAM policies, and DDoS mitigation strategies.",
    "requirements": "\u2022 2+ years experience in cloud security, firewall configuration, and IAM least-privilege policies\n\u2022 Knowledge of CIS benchmarks and container security"
  },
  {
    "id": "demo-cs-7",
    "title": "Digital Forensics & Malware Analyst",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Cybersecurity",
    "jobType": "Full-time",
    "salaryMin": 58000,
    "salaryMax": 88000,
    "vacancies": 1,
    "daysToDeadline": 30,
    "description": "Investigate endpoint security incidents, perform log forensics, and strengthen threat intelligence feeds for financial systems.",
    "requirements": "\u2022 Strong background in OS internals, memory forensics, and EDR telemetry\n\u2022 Clear technical report writing and incident documentation"
  },
  {
    "id": "demo-ai-1",
    "title": "Machine Learning & NLP Engineer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Remote",
    "category": "Data & AI",
    "jobType": "Full-time",
    "salaryMin": 75000,
    "salaryMax": 120000,
    "vacancies": 2,
    "daysToDeadline": 35,
    "description": "Develop Bengali and English text classification models, recommendation engines, and automated resume-matching pipelines.",
    "requirements": "\u2022 Strong proficiency in Python, PyTorch/Scikit-learn, and FastAPI\n\u2022 Experience with embeddings, vector databases, and recommendation algorithms"
  },
  {
    "id": "demo-ai-2",
    "title": "AI & LLM Integration Specialist",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Remote",
    "category": "Data & AI",
    "jobType": "Contract",
    "salaryMin": 70000,
    "salaryMax": 110000,
    "vacancies": 2,
    "daysToDeadline": 35,
    "description": "Build RAG pipelines, developer productivity agents, and intelligent search features for enterprise web portals.",
    "requirements": "\u2022 Experience with Node.js/Python and modern LLM APIs (Gemini, OpenAI)\n\u2022 Understanding of vector search, prompt engineering, and latency optimization"
  },
  {
    "id": "demo-ai-3",
    "title": "FinTech Data Analyst",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Data & AI",
    "jobType": "Full-time",
    "salaryMin": 50000,
    "salaryMax": 75000,
    "vacancies": 2,
    "daysToDeadline": 24,
    "description": "Analyze daily transaction cohorts, merchant retention, and revenue KPIs using SQL, Python, and interactive BI dashboards.",
    "requirements": "\u2022 Proficiency in SQL queries, Python (Pandas), and Power BI/Tableau\n\u2022 Ability to translate financial metrics into clear product insights"
  },
  {
    "id": "demo-ai-4",
    "title": "Data Science & Predictive Analytics Associate",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Data & AI",
    "jobType": "Full-time",
    "salaryMin": 58000,
    "salaryMax": 88000,
    "vacancies": 2,
    "daysToDeadline": 29,
    "description": "Build credit-scoring models, fraud-detection classifiers, and customer churn forecasts for digital financial products.",
    "requirements": "\u2022 Strong command of Python, NumPy, Pandas, XGBoost, and SQL\n\u2022 Solid foundation in statistics, hypothesis testing, and feature engineering"
  },
  {
    "id": "demo-ai-5",
    "title": "Computer Vision & Image Processing Engineer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Data & AI",
    "jobType": "Full-time",
    "salaryMin": 62000,
    "salaryMax": 95000,
    "vacancies": 2,
    "daysToDeadline": 32,
    "description": "Develop e-KYC document OCR, facial verification pipelines, and real-time object detection models using OpenCV and PyTorch.",
    "requirements": "\u2022 Experience with OpenCV, YOLO, PyTorch/TensorFlow, and image processing algorithms\n\u2022 B.Sc. in CSE/CS with coursework in Image Processing or AI"
  },
  {
    "id": "demo-ai-6",
    "title": "ETL Data Engineer (Python & SQL)",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Remote",
    "category": "Data & AI",
    "jobType": "Full-time",
    "salaryMin": 68000,
    "salaryMax": 105000,
    "vacancies": 1,
    "daysToDeadline": 27,
    "description": "Design resilient data warehouses, automated Airflow DAGs, and real-time analytics streaming pipelines.",
    "requirements": "\u2022 Proficiency in Python, advanced SQL, PostgreSQL, and MongoDB aggregations\n\u2022 Experience with Apache Airflow, dbt, or cloud data warehouses"
  },
  {
    "id": "demo-ai-7",
    "title": "Junior Data Analytics Intern",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Data & AI",
    "jobType": "Internship",
    "salaryMin": 15000,
    "salaryMax": 20000,
    "vacancies": 3,
    "daysToDeadline": 22,
    "description": "Support the BI team in cleaning datasets, writing SQL reports, and building executive KPI visualizations.",
    "requirements": "\u2022 Strong skills in Excel, SQL, Python (Pandas/Matplotlib), and Power BI\n\u2022 Final-year undergraduate in CSE, Statistics, or Data Science"
  },
  {
    "id": "demo-ux-1",
    "title": "Senior Product UI/UX Designer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "UI/UX Design",
    "jobType": "Full-time",
    "salaryMin": 55000,
    "salaryMax": 85000,
    "vacancies": 1,
    "daysToDeadline": 19,
    "description": "Lead the design system and mobile-first user journeys for FinPulse Digital Lab consumer wallet and merchant dashboard.",
    "requirements": "\u2022 Portfolio demonstrating clean web & mobile fintech workflows\n\u2022 Mastery of Figma auto-layout, component libraries, and usability testing"
  },
  {
    "id": "demo-ux-2",
    "title": "Product Designer & Design System Specialist",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Remote",
    "category": "UI/UX Design",
    "jobType": "Contract",
    "salaryMin": 48000,
    "salaryMax": 78000,
    "vacancies": 2,
    "daysToDeadline": 29,
    "description": "Craft cohesive Figma component libraries, interactive mobile prototypes, and user-tested workflows for SaaS products.",
    "requirements": "\u2022 Strong portfolio of web and mobile UI/UX case studies\n\u2022 Expertise in Figma variables, auto-layout, and WCAG accessibility standards"
  },
  {
    "id": "demo-ux-3",
    "title": "UI/UX Design Intern",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Dhaka",
    "category": "UI/UX Design",
    "jobType": "Internship",
    "salaryMin": 14000,
    "salaryMax": 20000,
    "vacancies": 3,
    "daysToDeadline": 29,
    "description": "Collaborate with senior product designers to create wireframes, interactive prototypes, and clean Tailwind UI components.",
    "requirements": "\u2022 Familiarity with Figma and modern web layout principles\n\u2022 Strong curiosity and eagerness to learn design systems"
  },
  {
    "id": "demo-ux-4",
    "title": "Mobile App UI/UX Designer (iOS & Android)",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "UI/UX Design",
    "jobType": "Full-time",
    "salaryMin": 42000,
    "salaryMax": 68000,
    "vacancies": 2,
    "daysToDeadline": 26,
    "description": "Design intuitive mobile user experiences, micro-interactions, and responsive onboarding flows for consumer apps.",
    "requirements": "\u2022 Deep understanding of Material Design 3 and Apple Human Interface Guidelines\n\u2022 Proficiency in Figma prototyping and user journey mapping"
  },
  {
    "id": "demo-ux-5",
    "title": "UX Researcher & Interaction Designer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Chattogram",
    "category": "UI/UX Design",
    "jobType": "Full-time",
    "salaryMin": 45000,
    "salaryMax": 70000,
    "vacancies": 1,
    "daysToDeadline": 31,
    "description": "Conduct usability interviews, A/B funnel experiments, and wireframe iterations to improve conversion rates.",
    "requirements": "\u2022 Experience running moderated user testing and heuristic evaluations\n\u2022 Strong visual storytelling and Figma wireframe skills"
  },
  {
    "id": "demo-ux-6",
    "title": "Creative Web & Brand Visual Designer",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Sylhet",
    "category": "UI/UX Design",
    "jobType": "Part-time",
    "salaryMin": 22000,
    "salaryMax": 35000,
    "vacancies": 2,
    "daysToDeadline": 24,
    "description": "Create high-converting landing pages, SVG illustrations, brand identity kits, and social media visual assets.",
    "requirements": "\u2022 Proficiency in Figma, Adobe Illustrator, and modern web typography\n\u2022 Strong eye for color harmony and responsive web grids"
  },
  {
    "id": "demo-do-1",
    "title": "DevOps & Cloud Infrastructure Engineer",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Remote",
    "category": "DevOps & Cloud",
    "jobType": "Full-time",
    "salaryMin": 65000,
    "salaryMax": 98000,
    "vacancies": 2,
    "daysToDeadline": 32,
    "description": "Manage containerized deployments, CI/CD pipelines, and automated monitoring across AWS and DigitalOcean.",
    "requirements": "\u2022 Hands-on experience with Docker, Nginx, GitHub Actions, and Linux administration\n\u2022 Focus on uptime, backups, and security best practices"
  },
  {
    "id": "demo-do-2",
    "title": "Kubernetes & Site Reliability Engineer (SRE)",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Remote",
    "category": "DevOps & Cloud",
    "jobType": "Full-time",
    "salaryMin": 85000,
    "salaryMax": 135000,
    "vacancies": 1,
    "daysToDeadline": 34,
    "description": "Architect auto-scaling Kubernetes clusters, zero-downtime deployment pipelines, and Prometheus/Grafana observability stacks.",
    "requirements": "\u2022 Strong experience with Docker, Kubernetes, Terraform, and AWS/GCP\n\u2022 Proficiency in bash/Python scripting and CI/CD automation"
  },
  {
    "id": "demo-do-3",
    "title": "Cloud Solutions Architect (Part-time)",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Rajshahi",
    "category": "DevOps & Cloud",
    "jobType": "Part-time",
    "salaryMin": 45000,
    "salaryMax": 70000,
    "vacancies": 1,
    "daysToDeadline": 17,
    "description": "Advise engineering squads on multi-tenant database scaling, caching strategies, and cloud cost optimization.",
    "requirements": "\u2022 Proven experience designing cloud-native web architectures\n\u2022 Deep knowledge of MongoDB aggregation, indexing, and Node.js scaling"
  },
  {
    "id": "demo-do-4",
    "title": "AWS Cloud & Linux Systems Administrator",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "DevOps & Cloud",
    "jobType": "Full-time",
    "salaryMin": 52000,
    "salaryMax": 80000,
    "vacancies": 2,
    "daysToDeadline": 28,
    "description": "Maintain production Ubuntu servers, SSL certificates, reverse proxies, automated database snapshots, and IAM policies.",
    "requirements": "\u2022 Strong command of Linux CLI, Bash scripting, Nginx, and AWS EC2/S3/RDS\n\u2022 Experience with server hardening and uptime monitoring"
  },
  {
    "id": "demo-do-5",
    "title": "CI/CD & Build Release Engineer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "DevOps & Cloud",
    "jobType": "Full-time",
    "salaryMin": 55000,
    "salaryMax": 84000,
    "vacancies": 1,
    "daysToDeadline": 25,
    "description": "Streamline automated build, test, and deployment workflows across GitHub Actions, Docker registries, and staging environments.",
    "requirements": "\u2022 Experience with Git branching strategies, GitHub Actions, Docker Compose, and Render/Netlify/Vercel deployments"
  },
  {
    "id": "demo-do-6",
    "title": "Junior Cloud & DevOps Trainee",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Dhaka",
    "category": "DevOps & Cloud",
    "jobType": "Internship",
    "salaryMin": 16000,
    "salaryMax": 24000,
    "vacancies": 3,
    "daysToDeadline": 30,
    "description": "Learn containerization, cloud hosting, domain DNS configuration, and automated deployment pipelines on real projects.",
    "requirements": "\u2022 Solid foundation in Linux commands, Git, networking basics, and Docker\n\u2022 Final-year CSE student or recent graduate"
  },
  {
    "id": "demo-qa-1",
    "title": "QA Automation Engineer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Quality Assurance",
    "jobType": "Full-time",
    "salaryMin": 40000,
    "salaryMax": 60000,
    "vacancies": 2,
    "daysToDeadline": 18,
    "description": "Design automated end-to-end and API test suites to guarantee zero-defect releases across web and mobile products.",
    "requirements": "\u2022 Experience with Postman, Playwright or Cypress, and REST API testing\n\u2022 Strong bug triage and documentation skills"
  },
  {
    "id": "demo-qa-2",
    "title": "Software Quality Assurance (SQA) Intern",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Quality Assurance",
    "jobType": "Internship",
    "salaryMin": 15000,
    "salaryMax": 22000,
    "vacancies": 4,
    "daysToDeadline": 27,
    "description": "Execute manual test plans, regression checklists, mobile responsiveness testing, and Postman API test collections.",
    "requirements": "\u2022 Final-year undergraduate or recent graduate in CSE/IT\n\u2022 Attention to detail and passion for finding UI/UX and functional edge cases"
  },
  {
    "id": "demo-qa-3",
    "title": "Senior SDET & Performance Test Lead",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Quality Assurance",
    "jobType": "Full-time",
    "salaryMin": 65000,
    "salaryMax": 95000,
    "vacancies": 1,
    "daysToDeadline": 29,
    "description": "Lead load testing, stress benchmarking (k6/JMeter), and automated regression frameworks for high-volume payment APIs.",
    "requirements": "\u2022 2+ years in test automation (Playwright/Selenium) and load testing (JMeter/k6)\n\u2022 Strong JavaScript/Python scripting skills"
  },
  {
    "id": "demo-qa-4",
    "title": "Mobile & Web Manual QA Analyst",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Quality Assurance",
    "jobType": "Full-time",
    "salaryMin": 32000,
    "salaryMax": 48000,
    "vacancies": 2,
    "daysToDeadline": 23,
    "description": "Verify cross-browser compatibility, mobile responsiveness, and user acceptance criteria across Android, iOS, and web apps.",
    "requirements": "\u2022 Experience writing structured test cases, bug reports in Jira, and SQL data verification\n\u2022 Strong eye for layout consistency"
  },
  {
    "id": "demo-qa-5",
    "title": "API & Security QA Tester (Remote)",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Remote",
    "category": "Quality Assurance",
    "jobType": "Remote",
    "salaryMin": 45000,
    "salaryMax": 68000,
    "vacancies": 2,
    "daysToDeadline": 31,
    "description": "Validate REST/GraphQL endpoints, payload validation rules, auth token expiration, and rate-limiting behavior.",
    "requirements": "\u2022 Mastery of Postman, Newman CLI, JSON schema validation, and OWASP API security basics"
  },
  {
    "id": "demo-qa-6",
    "title": "Junior QA & Bug Triage Associate",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Sylhet",
    "category": "Quality Assurance",
    "jobType": "Part-time",
    "salaryMin": 20000,
    "salaryMax": 30000,
    "vacancies": 2,
    "daysToDeadline": 21,
    "description": "Reproduce customer-reported issues, verify hotfixes on staging environments, and maintain regression documentation.",
    "requirements": "\u2022 Familiarity with browser DevTools, network tab inspection, and agile sprint workflows"
  },
  {
    "id": "demo-mk-1",
    "title": "Digital Marketing & Growth Specialist",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Marketing",
    "jobType": "Full-time",
    "salaryMin": 35000,
    "salaryMax": 52000,
    "vacancies": 2,
    "daysToDeadline": 21,
    "description": "Plan and execute performance campaigns, SEO content strategy, and campus ambassador programs across Bangladesh.",
    "requirements": "\u2022 Experience with Google Analytics, Meta Ads, and conversion funnels\n\u2022 Strong copywriting and analytical mindset"
  },
  {
    "id": "demo-mk-2",
    "title": "Business Development Executive",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Marketing",
    "jobType": "Full-time",
    "salaryMin": 38000,
    "salaryMax": 58000,
    "vacancies": 4,
    "daysToDeadline": 16,
    "description": "Onboard enterprise merchants and e-commerce partners onto FinPulse payment solutions.",
    "requirements": "\u2022 Excellent presentation and negotiation skills\n\u2022 Passion for fintech and B2B relationship management"
  },
  {
    "id": "demo-mk-3",
    "title": "SEO & Content Marketing Strategist",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Sylhet",
    "category": "Marketing",
    "jobType": "Part-time",
    "salaryMin": 24000,
    "salaryMax": 38000,
    "vacancies": 2,
    "daysToDeadline": 25,
    "description": "Lead organic search growth, technical SEO audits, keyword research, and high-converting SaaS content campaigns.",
    "requirements": "\u2022 Proven track record with Google Search Console, Ahrefs/SEMrush, and content analytics\n\u2022 Excellent English writing skills"
  },
  {
    "id": "demo-mk-4",
    "title": "Technical Content Writer (Web & Cloud)",
    "companyName": "CloudForge Studio",
    "isVerified": false,
    "location": "Remote",
    "category": "Marketing",
    "jobType": "Part-time",
    "salaryMin": 20000,
    "salaryMax": 32000,
    "vacancies": 2,
    "daysToDeadline": 26,
    "description": "Write developer documentation, API integration guides, and engineering blog tutorials.",
    "requirements": "\u2022 Strong command of technical English and Markdown\n\u2022 Ability to explain JavaScript, REST APIs, and cloud concepts clearly"
  },
  {
    "id": "demo-mk-5",
    "title": "SaaS Product Marketing Manager",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Marketing",
    "jobType": "Full-time",
    "salaryMin": 50000,
    "salaryMax": 76000,
    "vacancies": 1,
    "daysToDeadline": 28,
    "description": "Drive B2B product launches, case studies, webinar campaigns, and competitive positioning for enterprise software.",
    "requirements": "\u2022 2+ years in B2B tech marketing, email automation, and LinkedIn campaign management"
  },
  {
    "id": "demo-mk-6",
    "title": "Social Media & Brand Communications Intern",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Marketing",
    "jobType": "Internship",
    "salaryMin": 14000,
    "salaryMax": 20000,
    "vacancies": 3,
    "daysToDeadline": 24,
    "description": "Create engaging tech community posts, employer branding stories, and event highlights across LinkedIn and Facebook.",
    "requirements": "\u2022 Creative copywriting in English & Bengali, Canva/Figma basics, and passion for tech culture"
  },
  {
    "id": "demo-mg-1",
    "title": "Agile Scrum Master & Product Owner",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Management",
    "jobType": "Full-time",
    "salaryMin": 65000,
    "salaryMax": 95000,
    "vacancies": 1,
    "daysToDeadline": 24,
    "description": "Facilitate agile ceremonies, prioritize product backlogs, and align engineering squads with business KPIs.",
    "requirements": "\u2022 2+ years in software project management or product ownership\n\u2022 Strong command of Jira, Agile/Scrum frameworks, and stakeholder communication"
  },
  {
    "id": "demo-mg-2",
    "title": "Technical Project Coordinator",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Management",
    "jobType": "Part-time",
    "salaryMin": 25000,
    "salaryMax": 38000,
    "vacancies": 1,
    "daysToDeadline": 15,
    "description": "Coordinate sprint ceremonies, client deliverables, and engineering milestones across cross-functional product squads.",
    "requirements": "\u2022 Strong written and verbal English communication\n\u2022 Experience with Jira, Notion, or Kanban boards"
  },
  {
    "id": "demo-mg-3",
    "title": "Associate Product Manager (FinTech)",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Management",
    "jobType": "Full-time",
    "salaryMin": 55000,
    "salaryMax": 85000,
    "vacancies": 2,
    "daysToDeadline": 29,
    "description": "Define product PRDs, user stories, and release roadmaps for digital wallet and merchant checkout experiences.",
    "requirements": "\u2022 Analytical thinker comfortable with SQL/funnel metrics, wireframing, and cross-team leadership"
  },
  {
    "id": "demo-mg-4",
    "title": "IT Operations & Delivery Manager",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Management",
    "jobType": "Full-time",
    "salaryMin": 70000,
    "salaryMax": 105000,
    "vacancies": 1,
    "daysToDeadline": 30,
    "description": "Oversee resource allocation, SLA compliance, vendor partnerships, and on-time delivery of client software engagements.",
    "requirements": "\u2022 3+ years managing software delivery teams, budgets, and enterprise client relationships"
  },
  {
    "id": "demo-mg-5",
    "title": "HR & Technical Talent Acquisition Specialist",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Management",
    "jobType": "Full-time",
    "salaryMin": 38000,
    "salaryMax": 58000,
    "vacancies": 2,
    "daysToDeadline": 22,
    "description": "Source, screen, and onboard top software engineers, cybersecurity analysts, and university interns across Bangladesh.",
    "requirements": "\u2022 Experience in technical recruitment, campus hiring drives, and candidate experience management"
  },
  {
    "id": "demo-mg-6",
    "title": "Engineering Operations & PMO Intern",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Rajshahi",
    "category": "Management",
    "jobType": "Internship",
    "salaryMin": 15000,
    "salaryMax": 21000,
    "vacancies": 2,
    "daysToDeadline": 26,
    "description": "Assist product managers and engineering leads with sprint velocity reports, release notes, and stakeholder updates.",
    "requirements": "\u2022 Strong organizational skills, proficiency in Notion/Jira/Excel, and clear English communication"
  },
  {
    "id": "demo-csup-1",
    "title": "Technical Support & Client Onboarding Engineer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Customer Support",
    "jobType": "Full-time",
    "salaryMin": 30000,
    "salaryMax": 45000,
    "vacancies": 3,
    "daysToDeadline": 22,
    "description": "Assist enterprise clients with API webhook integration, account setup, troubleshooting, and live technical consultations.",
    "requirements": "\u2022 Clear communication skills in Bengali and English\n\u2022 Basic understanding of web browsers, REST APIs, and SQL queries"
  },
  {
    "id": "demo-csup-2",
    "title": "Customer Success & Support Associate",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Remote",
    "category": "Customer Support",
    "jobType": "Part-time",
    "salaryMin": 18000,
    "salaryMax": 26000,
    "vacancies": 4,
    "daysToDeadline": 14,
    "description": "Resolve merchant technical queries and guide users through account verification and payout workflows.",
    "requirements": "\u2022 Fluent in Bengali and English communication\n\u2022 Empathetic problem solver comfortable with ticketing tools"
  },
  {
    "id": "demo-csup-3",
    "title": "Enterprise SaaS Account Support Specialist",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Customer Support",
    "jobType": "Full-time",
    "salaryMin": 32000,
    "salaryMax": 48000,
    "vacancies": 2,
    "daysToDeadline": 27,
    "description": "Provide dedicated L1/L2 application support, conduct live product walkthroughs, and maintain helpdesk knowledge bases.",
    "requirements": "\u2022 Experience with Zendesk/Freshdesk, CRM tools, and troubleshooting web applications"
  },
  {
    "id": "demo-csup-4",
    "title": "Merchant Operations & Dispute Resolution Officer",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Customer Support",
    "jobType": "Full-time",
    "salaryMin": 28000,
    "salaryMax": 42000,
    "vacancies": 3,
    "daysToDeadline": 25,
    "description": "Handle payment reconciliation inquiries, KYC verification reviews, and merchant settlement support tickets.",
    "requirements": "\u2022 Detail-oriented mindset, proficiency in spreadsheets, and strong professional communication"
  },
  {
    "id": "demo-csup-5",
    "title": "Remote Technical Helpdesk Representative",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Remote",
    "category": "Customer Support",
    "jobType": "Remote",
    "salaryMin": 26000,
    "salaryMax": 38000,
    "vacancies": 3,
    "daysToDeadline": 29,
    "description": "Respond to global SaaS user inquiries via live chat and email, document bug reproductions, and escalate priority tickets.",
    "requirements": "\u2022 Strong written English, familiarity with SaaS dashboards, and fast response discipline"
  },
  {
    "id": "demo-csup-6",
    "title": "Client Experience & Support Intern",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Sylhet",
    "category": "Customer Support",
    "jobType": "Internship",
    "salaryMin": 12000,
    "salaryMax": 18000,
    "vacancies": 4,
    "daysToDeadline": 23,
    "description": "Learn SaaS customer onboarding, FAQ documentation, and live support workflows alongside the customer success team.",
    "requirements": "\u2022 Friendly communicator in Bengali and English with strong computer literacy"
  },
  {
    "id": "demo-oth-1",
    "title": "Corporate Finance & Accounts Executive",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Finance & Accounting",
    "jobType": "Full-time",
    "salaryMin": 42000,
    "salaryMax": 65000,
    "vacancies": 2,
    "daysToDeadline": 26,
    "description": "Manage monthly financial statements, VAT/Tax compliance, payroll reconciliation, and audit documentation.",
    "requirements": "\u2022 BBA/MBA in Finance or Accounting\n\u2022 Proficiency in Tally, QuickBooks, and advanced Excel modeling"
  },
  {
    "id": "demo-oth-2",
    "title": "Human Resources (HR) & People Operations Officer",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Human Resources (HR)",
    "jobType": "Full-time",
    "salaryMin": 38000,
    "salaryMax": 55000,
    "vacancies": 2,
    "daysToDeadline": 25,
    "description": "Lead employee onboarding, performance appraisal cycles, workplace culture initiatives, and HR policy compliance.",
    "requirements": "\u2022 BBA/MBA in HRM or related discipline\n\u2022 Strong interpersonal and Bangladesh Labor Law knowledge"
  },
  {
    "id": "demo-oth-3",
    "title": "Electrical & Smart Grid Project Engineer",
    "companyName": "CloudForge Studio",
    "isVerified": true,
    "location": "Chattogram",
    "category": "Electrical & Civil Engineering",
    "jobType": "Full-time",
    "salaryMin": 50000,
    "salaryMax": 78000,
    "vacancies": 2,
    "daysToDeadline": 28,
    "description": "Design IoT power monitoring units, data center backup systems, and industrial automation layouts.",
    "requirements": "\u2022 B.Sc. in EEE / Civil Engineering\n\u2022 Hands-on experience with AutoCAD, PLC, and embedded systems"
  },
  {
    "id": "demo-oth-4",
    "title": "Healthcare Informatics & Clinical Data Coordinator",
    "companyName": "FinPulse Digital Lab",
    "isVerified": true,
    "location": "Dhaka",
    "category": "Healthcare & Pharma",
    "jobType": "Full-time",
    "salaryMin": 40000,
    "salaryMax": 62000,
    "vacancies": 2,
    "daysToDeadline": 27,
    "description": "Coordinate digital hospital management records, telemedicine workflows, and healthcare compliance reporting.",
    "requirements": "\u2022 Background in Pharmacy, Public Health, or Health Informatics\n\u2022 Strong analytical and communication skills"
  },
  {
    "id": "demo-oth-5",
    "title": "STEM & Programming Instructor (Part-time)",
    "companyName": "TechNova Solutions BD",
    "isVerified": true,
    "location": "Remote",
    "category": "Education & Training",
    "jobType": "Part-time",
    "salaryMin": 22000,
    "salaryMax": 35000,
    "vacancies": 3,
    "daysToDeadline": 30,
    "description": "Conduct live online bootcamps and university career workshops on web development, Python, and problem solving.",
    "requirements": "\u2022 Strong teaching passion and clear explanation skills in Bengali & English"
  }
];

const COMPANY_DETAILS = {
  'TechNova Solutions BD': {
    name: 'TechNova Solutions BD',
    logoPath: '',
    description:
      'Leading enterprise software and AI solutions company in Dhaka building scalable cloud and fintech platforms across South Asia.',
    website: 'https://technovabd.example.com',
    industry: 'Software & IT Services',
    location: 'Gulshan-2, Dhaka',
    size: '51-200 employees',
    isVerified: true,
  },
  'FinPulse Digital Lab': {
    name: 'FinPulse Digital Lab',
    logoPath: '',
    description:
      'Next-generation digital payment gateway, micro-investing, and financial analytics platform serving millions of users.',
    website: 'https://finpulseltd.example.com',
    industry: 'FinTech & Banking',
    location: 'Banani, Dhaka',
    size: '201-500 employees',
    isVerified: true,
  },
  'CloudForge Studio': {
    name: 'CloudForge Studio',
    logoPath: '',
    description:
      'Creative product studio specializing in SaaS design systems, DevOps automation, and cross-platform mobile apps.',
    website: 'https://cloudforge.example.com',
    industry: 'Cloud & Product Design',
    location: 'Uttara, Dhaka (Hybrid)',
    size: '11-50 employees',
    isVerified: true,
  },
};

const nowMs = Date.now();

export const DEMO_JOBS_CATALOG = RAW_DEMO_JOBS.map((item, idx) => ({
  _id: item.id,
  title: item.title,
  description: item.description,
  requirements: item.requirements,
  category: item.category,
  location: item.location,
  jobType: item.jobType,
  salaryMin: item.salaryMin,
  salaryMax: item.salaryMax,
  vacancies: item.vacancies,
  deadline: new Date(nowMs + (item.daysToDeadline || 28) * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(nowMs - ((idx % 12) + 1) * 24 * 60 * 60 * 1000).toISOString(),
  isActive: true,
  company: COMPANY_DETAILS[item.companyName] || {
    name: item.companyName,
    isVerified: item.isVerified,
    industry: 'Technology',
    location: item.location,
    size: '51-200 employees',
  },
}));

/**
 * Merges backend API jobs with the 60-job multi-sector demo catalog (deduplicated by title)
 * so all 60+ jobs across every sector are always available immediately.
 */
export const mergeWithDemoJobs = (apiJobs = []) => {
  const seenTitles = new Set();
  const merged = [];

  (apiJobs || []).forEach((job) => {
    if (job && job.title) {
      seenTitles.add(job.title.trim().toLowerCase());
      merged.push(job);
    }
  });

  DEMO_JOBS_CATALOG.forEach((demoJob) => {
    const key = demoJob.title.trim().toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      merged.push(demoJob);
    }
  });

  return merged;
};

export const getDemoJobById = (id) => {
  if (!id) return null;
  return DEMO_JOBS_CATALOG.find((j) => String(j._id) === String(id)) || null;
};

let syncInProgress = false;

export const syncAdditionalJobsIfNeeded = async () => {
  if (syncInProgress) return false;
  if (sessionStorage.getItem('hiresphere_60_jobs_synced') === 'true') return false;

  syncInProgress = true;
  try {
    const cleanClient = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    const { data: listRes } = await cleanClient.get('/jobs?limit=100');
    const existingJobs = listRes?.data?.jobs || [];
    const total = listRes?.data?.pagination?.total || existingJobs.length;

    if (total >= 55) {
      sessionStorage.setItem('hiresphere_60_jobs_synced', 'true');
      syncInProgress = false;
      return false;
    }

    const existingTitles = new Set(existingJobs.map((j) => j.title.trim().toLowerCase()));
    const missingJobs = RAW_DEMO_JOBS.filter(
      (item) => !existingTitles.has(item.title.trim().toLowerCase())
    );

    if (missingJobs.length === 0) {
      sessionStorage.setItem('hiresphere_60_jobs_synced', 'true');
      syncInProgress = false;
      return false;
    }

    const employerCreds = [
      { email: 'hr@technovabd.com', password: 'Employer@123' },
      { email: 'careers@finpulseltd.com', password: 'Employer@123' },
    ];

    const tokens = [];
    for (const cred of employerCreds) {
      try {
        const { data: authRes } = await cleanClient.post('/auth/login', cred);
        if (authRes?.data?.token) {
          tokens.push(authRes.data.token);
        }
      } catch {
        // Ignore
      }
    }

    if (tokens.length === 0) {
      sessionStorage.setItem('hiresphere_60_jobs_synced', 'true');
      syncInProgress = false;
      return false;
    }

    const now = Date.now();
    let createdAny = false;

    for (let i = 0; i < missingJobs.length; i += 1) {
      const item = missingJobs[i];
      const token = tokens[i % tokens.length] || tokens[0];
      const deadlineDate = new Date(now + (item.daysToDeadline || 28) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      try {
        await cleanClient.post(
          '/jobs',
          {
            title: item.title,
            description: item.description,
            requirements: item.requirements,
            category: item.category,
            location: item.location,
            jobType: item.jobType,
            salaryMin: item.salaryMin,
            salaryMax: item.salaryMax,
            vacancies: item.vacancies,
            deadline: deadlineDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        createdAny = true;
      } catch {
        // Ignore individual failure
      }
    }

    sessionStorage.setItem('hiresphere_60_jobs_synced', 'true');
    syncInProgress = false;
    return createdAny;
  } catch {
    syncInProgress = false;
    return false;
  }
};

export const computeJobRecommendations = (allJobs = [], profile = null, applications = []) => {
  const sourceJobs = mergeWithDemoJobs(allJobs);
  const appliedIds = new Set(
    (applications || []).map((a) => String(a.job?._id || a.job))
  );

  let savedPrefs = {};
  try {
    const raw = localStorage.getItem('hiresphere_seeker_prefs');
    if (raw) savedPrefs = JSON.parse(raw);
  } catch {
    savedPrefs = {};
  }

  const profileSkills = Array.isArray(profile?.skills) ? profile.skills : [];
  const prefSkills = Array.isArray(savedPrefs?.skills) ? savedPrefs.skills : [];
  const combinedSkills = [...new Set([...profileSkills, ...prefSkills])]
    .map((s) => String(s).toLowerCase().trim())
    .filter(Boolean);

  const headline = (
    profile?.headline ||
    savedPrefs?.preferredCategory ||
    ''
  ).toLowerCase();
  const preferredCategory = (savedPrefs?.preferredCategory || '').toLowerCase();
  const userLocation = (profile?.location || savedPrefs?.location || '').toLowerCase();

  const availableJobs = sourceJobs.filter(
    (job) => !appliedIds.has(String(job._id)) && new Date(job.deadline) >= new Date()
  );

  const scored = availableJobs.map((job) => {
    const searchable = `${job.title} ${job.category} ${job.description} ${job.requirements}`.toLowerCase();
    let score = 0;
    const matchedSkills = [];

    combinedSkills.forEach((skill) => {
      if (skill && searchable.includes(skill)) {
        score += 15;
        matchedSkills.push(skill);
      }
    });

    if (preferredCategory && job.category?.toLowerCase() === preferredCategory) {
      score += 25;
    }

    if (headline && headline !== 'aspiring professional') {
      const tokens = headline
        .split(/[\s,/&-]+/)
        .map((t) => t.trim())
        .filter(
          (t) =>
            t.length > 2 &&
            !['and', 'the', 'for', 'specialist', 'professional', 'aspiring'].includes(t)
        );
      tokens.forEach((token) => {
        if (searchable.includes(token)) score += 8;
      });
      if (job.category && headline.includes(job.category.toLowerCase())) {
        score += 18;
      }
    }

    if (userLocation && job.location && userLocation.includes(job.location.toLowerCase())) {
      score += 5;
    }

    if (job.company?.isVerified) {
      score += 4;
    }

    let matchReason = `Top Opening in ${job.category}`;
    if (matchedSkills.length > 0) {
      const formatted = matchedSkills
        .slice(0, 3)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(', ');
      matchReason = `Matches your skills: ${formatted}`;
    } else if (preferredCategory && job.category?.toLowerCase() === preferredCategory) {
      matchReason = `Matches your ${job.category} interest`;
    } else if (score >= 12) {
      matchReason = `Recommended in ${job.category}`;
    } else if (job.company?.isVerified) {
      matchReason = `Verified Employer • ${job.category}`;
    }

    return {
      ...job,
      recommendationScore: score,
      matchReason,
    };
  });

  scored.sort((a, b) => {
    if (b.recommendationScore !== a.recommendationScore) {
      return b.recommendationScore - a.recommendationScore;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return scored;
};
