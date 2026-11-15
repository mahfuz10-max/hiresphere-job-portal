const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Profile = require('../models/Profile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');
const { ensureAdditionalJobs } = require('../utils/ensureAdditionalJobs');

dotenv.config();

const ensureSampleResume = () => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const samplePdfPath = path.join(uploadsDir, 'sample_resume_hiresphere.pdf');
  if (!fs.existsSync(samplePdfPath)) {
    const minimalPdf = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj
4 0 obj << /Length 68 >> stream
BT /F1 18 Tf 72 720 Td (HireSphere Candidate Sample Resume CV) Tj ET
endstream endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000203 00000 n 
trailer << /Size 5 /Root 1 0 R >>
startxref
320
%%EOF`;
    fs.writeFileSync(samplePdfPath, minimalPdf);
  }
  return '/uploads/sample_resume_hiresphere.pdf';
};

const seedDatabase = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.warn('Warning: Refusing to run seed script when NODE_ENV=production.');
      process.exit(1);
    }

    await connectDB();

    console.warn('WARNING: This script wipes all existing HireSphere collections in the database.');
    console.log('Clearing existing HireSphere collections...');
    await Promise.all([
      Application.deleteMany({}),
      SavedJob.deleteMany({}),
      Job.deleteMany({}),
      Company.deleteMany({}),
      Profile.deleteMany({}),
      User.deleteMany({}),
    ]);

    const resumeUrl = ensureSampleResume();
    const now = new Date();
    const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // 1. Create Admin Account
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@hiresphere.com',
      password: 'Admin@123',
      role: 'ADMIN',
      createdAt: daysAgo(150),
    });

    // 2. Create 3 Employer Accounts & Companies (2 Verified, 1 Pending Verification)
    const employerUsers = await User.create([
      {
        name: 'Tanvir Ahmed',
        email: 'hr@technovabd.com',
        password: 'Employer@123',
        role: 'EMPLOYER',
        createdAt: daysAgo(120),
      },
      {
        name: 'Nusrat Jahan',
        email: 'careers@finpulseltd.com',
        password: 'Employer@123',
        role: 'EMPLOYER',
        createdAt: daysAgo(90),
      },
      {
        name: 'Rafiqul Islam',
        email: 'talent@cloudforge.io',
        password: 'Employer@123',
        role: 'EMPLOYER',
        createdAt: daysAgo(45),
      },
    ]);

    const companies = await Company.create([
      {
        owner: employerUsers[0]._id,
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
      {
        owner: employerUsers[1]._id,
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
      {
        owner: employerUsers[2]._id,
        name: 'CloudForge Studio',
        logoPath: '',
        description:
          'Creative product studio specializing in SaaS design systems, DevOps automation, and cross-platform mobile apps.',
        website: 'https://cloudforge.example.com',
        industry: 'Cloud & Product Design',
        location: 'Uttara, Dhaka (Hybrid)',
        size: '11-50 employees',
        isVerified: false,
      },
    ]);

    // 3. Create 5 Job Seeker Accounts + Profiles
    const seekerUsers = await User.create([
      {
        name: 'Mustafizur Rahman Mahfuz',
        email: 'mahfuz@hiresphere.com',
        password: 'Seeker@123',
        role: 'JOB_SEEKER',
        createdAt: daysAgo(100),
      },
      {
        name: 'Md. Sajid Islam',
        email: 'sajid@hiresphere.com',
        password: 'Seeker@123',
        role: 'JOB_SEEKER',
        createdAt: daysAgo(80),
      },
      {
        name: 'Farhana Yasmin',
        email: 'farhana@hiresphere.com',
        password: 'Seeker@123',
        role: 'JOB_SEEKER',
        createdAt: daysAgo(60),
      },
      {
        name: 'Arifur Rahman',
        email: 'arif@hiresphere.com',
        password: 'Seeker@123',
        role: 'JOB_SEEKER',
        createdAt: daysAgo(35),
      },
      {
        name: 'Tasnim Kabir',
        email: 'tasnim@hiresphere.com',
        password: 'Seeker@123',
        role: 'JOB_SEEKER',
        createdAt: daysAgo(15),
      },
    ]);

    await Profile.create([
      {
        user: seekerUsers[0]._id,
        phone: '+880 1711-223344',
        location: 'Niketan, Gulshan, Dhaka',
        headline: 'Full-Stack MERN Developer & Cybersecurity Enthusiast',
        education: 'B.Sc. in Computer Science & Engineering, Southeast University (Fourth Year)',
        skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'REST API', 'JWT Security'],
        experience: '2+ years building freelance full-stack web apps, student portals, and interactive web applications.',
        about: 'Passionate software engineer focused on clean architecture, modern UI/UX, and secure web applications.',
        resumePath: resumeUrl,
      },
      {
        user: seekerUsers[1]._id,
        phone: '+880 1812-334455',
        location: 'Mirpur, Dhaka',
        headline: 'Backend Engineer & Database Architect',
        education: 'B.Sc. in Computer Science & Engineering, Southeast University',
        skills: ['Node.js', 'MongoDB', 'PostgreSQL', 'Docker', 'Express.js', 'Redis'],
        experience: '1.5 years developing REST APIs, authentication pipelines, and microservices.',
        about: 'Detail-oriented backend developer passionate about high-performance APIs and scalable data modeling.',
        resumePath: resumeUrl,
      },
      {
        user: seekerUsers[2]._id,
        phone: '+880 1913-445566',
        location: 'Dhanmondi, Dhaka',
        headline: 'UI/UX Product Designer & Frontend Developer',
        education: 'B.Sc. in CSE, Dhaka',
        skills: ['Figma', 'React.js', 'Tailwind CSS', 'Design Systems', 'Prototyping', 'User Research'],
        experience: '2 years designing SaaS dashboards, mobile banking flows, and responsive web interfaces.',
        about: 'Human-centered designer bridging research and responsive frontend engineering.',
        resumePath: resumeUrl,
      },
      {
        user: seekerUsers[3]._id,
        phone: '+880 1614-556677',
        location: 'Chattogram, Bangladesh',
        headline: 'Data Analyst & Business Intelligence Specialist',
        education: 'B.Sc. in Statistics & Data Science',
        skills: ['Python', 'SQL', 'Power BI', 'Pandas', 'Data Visualization', 'Excel'],
        experience: '1 year in fintech reporting and customer cohort analytics.',
        about: 'Turning complex datasets into clear strategic product decisions.',
        resumePath: resumeUrl,
      },
      {
        user: seekerUsers[4]._id,
        phone: '+880 1515-667788',
        location: 'Sylhet, Bangladesh',
        headline: 'DevOps & Cloud Security Associate',
        education: 'B.Sc. in Computer Science & Engineering',
        skills: ['AWS', 'Linux', 'Docker', 'CI/CD', 'GitHub Actions', 'Penetration Testing'],
        experience: '1 year automating cloud deployments and conducting web application security audits.',
        about: 'Dedicated to resilient cloud infrastructure and DevSecOps automation.',
        resumePath: resumeUrl,
      },
    ]);

    // 4. Create 20 Realistic Jobs across categories, locations, and job types
    const jobsData = [
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'Full-Stack MERN Developer',
        description:
          'We are looking for a Full-Stack MERN Developer to build and scale enterprise SaaS modules, RESTful services, and responsive React dashboards.',
        requirements:
          '• Strong proficiency in React.js, Node.js, Express.js, and MongoDB\n• Experience with JWT authentication, RBAC, and Tailwind CSS\n• Familiarity with Git workflow and REST API design',
        category: 'Software Engineering',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 55000,
        salaryMax: 85000,
        vacancies: 3,
        deadline: daysFromNow(25),
        createdAt: daysAgo(12),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'Frontend React.js Engineer',
        description:
          'Join TechNova Solutions BD to craft fast, accessible, and responsive web interfaces using React 18, Vite, and Tailwind CSS.',
        requirements:
          '• 1+ year experience with React hooks, context, and React Router v6\n• Strong command of modern ES6+ JavaScript and responsive CSS\n• Eye for typography, spacing, and visual polish',
        category: 'Software Engineering',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 45000,
        salaryMax: 70000,
        vacancies: 2,
        deadline: daysFromNow(20),
        createdAt: daysAgo(20),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'Junior Web Developer Intern',
        description:
          'Hands-on 4-month paid internship for final-year CSE undergraduates eager to work on production React and Express projects.',
        requirements:
          '• Pursuing B.Sc. in CSE/CS or recent graduate\n• Solid foundation in HTML5, CSS3, JavaScript, and React basics\n• Eagerness to learn code review and agile workflows',
        category: 'Software Engineering',
        location: 'Dhaka',
        jobType: 'Internship',
        salaryMin: 15000,
        salaryMax: 22000,
        vacancies: 5,
        deadline: daysFromNow(30),
        createdAt: daysAgo(5),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'Cybersecurity & Penetration Testing Analyst',
        description:
          'Perform vulnerability assessments, OWASP Top 10 security audits, and API security hardening across our client applications.',
        requirements:
          '• Knowledge of web application security, Burp Suite, and OWASP standards\n• Certification or training in Penetration Testing (e.g., C)PTE, CEH) is a plus\n• Ability to write clear remediation reports',
        category: 'Cybersecurity',
        location: 'Remote',
        jobType: 'Full-time',
        salaryMin: 60000,
        salaryMax: 95000,
        vacancies: 2,
        deadline: daysFromNow(28),
        createdAt: daysAgo(18),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'QA Automation Engineer',
        description:
          'Design automated end-to-end and API test suites to guarantee zero-defect releases across web and mobile products.',
        requirements:
          '• Experience with Postman, Playwright or Cypress, and REST API testing\n• Strong bug triage and documentation skills',
        category: 'Quality Assurance',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 40000,
        salaryMax: 60000,
        vacancies: 2,
        deadline: daysFromNow(18),
        createdAt: daysAgo(40),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'Technical Project Coordinator',
        description:
          'Coordinate sprint ceremonies, client deliverables, and engineering milestones across cross-functional product squads.',
        requirements:
          '• Strong written and verbal English communication\n• Experience with Jira, Notion, or Kanban boards\n• Background in software engineering or CSE',
        category: 'Management',
        location: 'Dhaka',
        jobType: 'Part-time',
        salaryMin: 25000,
        salaryMax: 38000,
        vacancies: 1,
        deadline: daysFromNow(15),
        createdAt: daysAgo(65),
      },
      {
        company: companies[0]._id,
        postedBy: employerUsers[0]._id,
        title: 'AI & LLM Integration Specialist',
        description:
          'Build RAG pipelines, developer productivity agents, and intelligent search features for enterprise web portals.',
        requirements:
          '• Experience with Node.js/Python and modern LLM APIs\n• Understanding of vector search, prompt engineering, and latency optimization',
        category: 'Data & AI',
        location: 'Remote',
        jobType: 'Contract',
        salaryMin: 70000,
        salaryMax: 110000,
        vacancies: 2,
        deadline: daysFromNow(35),
        createdAt: daysAgo(95),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Backend Node.js & Microservices Engineer',
        description:
          'Architect high-throughput payment settlement APIs, webhook processors, and MongoDB/PostgreSQL data pipelines.',
        requirements:
          '• 2+ years in Node.js, Express.js, and database indexing\n• Strong understanding of transactional integrity and JWT/OAuth2 security',
        category: 'Software Engineering',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 65000,
        salaryMax: 100000,
        vacancies: 3,
        deadline: daysFromNow(22),
        createdAt: daysAgo(10),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'FinTech Data Analyst',
        description:
          'Analyze daily transaction cohorts, merchant retention, and revenue KPIs using SQL, Python, and interactive BI dashboards.',
        requirements:
          '• Proficiency in SQL queries, Python (Pandas), and Recharts/Power BI\n• Ability to translate financial metrics into clear product insights',
        category: 'Data & AI',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 50000,
        salaryMax: 75000,
        vacancies: 2,
        deadline: daysFromNow(24),
        createdAt: daysAgo(28),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Senior Product UI/UX Designer',
        description:
          'Lead the design system and mobile-first user journeys for FinPulse Digital Lab consumer wallet and merchant dashboard.',
        requirements:
          '• Portfolio demonstrating clean web & mobile fintech workflows\n• Mastery of Figma auto-layout, component libraries, and usability testing',
        category: 'UI/UX Design',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 55000,
        salaryMax: 85000,
        vacancies: 1,
        deadline: daysFromNow(19),
        createdAt: daysAgo(50),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Information Security & Compliance Officer',
        description:
          'Oversee PCI-DSS compliance, access control audits, and incident response readiness for digital banking products.',
        requirements:
          '• Solid understanding of network security, encryption, and access control\n• Experience auditing cloud and web infrastructure',
        category: 'Cybersecurity',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 70000,
        salaryMax: 105000,
        vacancies: 1,
        deadline: daysFromNow(27),
        createdAt: daysAgo(75),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Digital Marketing & Growth Specialist',
        description:
          'Plan and execute performance campaigns, SEO content strategy, and campus ambassador programs across Bangladesh.',
        requirements:
          '• Experience with Google Analytics, Meta Ads, and conversion funnels\n• Strong copywriting and analytical mindset',
        category: 'Marketing',
        location: 'Chattogram',
        jobType: 'Full-time',
        salaryMin: 35000,
        salaryMax: 52000,
        vacancies: 2,
        deadline: daysFromNow(21),
        createdAt: daysAgo(110),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Business Development Executive',
        description:
          'Onboard enterprise merchants and e-commerce partners onto FinPulse payment solutions.',
        requirements:
          '• Excellent presentation and negotiation skills\n• Passion for fintech and B2B relationship management',
        category: 'Marketing',
        location: 'Dhaka',
        jobType: 'Full-time',
        salaryMin: 38000,
        salaryMax: 58000,
        vacancies: 4,
        deadline: daysFromNow(16),
        createdAt: daysAgo(130),
      },
      {
        company: companies[1]._id,
        postedBy: employerUsers[1]._id,
        title: 'Customer Success & Support Associate',
        description:
          'Resolve merchant technical queries and guide users through account verification and payout workflows.',
        requirements:
          '• Fluent in Bengali and English communication\n• Empathetic problem solver comfortable with ticketing tools',
        category: 'Customer Support',
        location: 'Remote',
        jobType: 'Part-time',
        salaryMin: 18000,
        salaryMax: 26000,
        vacancies: 4,
        deadline: daysFromNow(14),
        createdAt: daysAgo(8),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'DevOps & Cloud Infrastructure Engineer',
        description:
          'Manage containerized deployments, CI/CD pipelines, and automated monitoring across AWS and DigitalOcean.',
        requirements:
          '• Hands-on experience with Docker, Nginx, GitHub Actions, and Linux administration\n• Focus on uptime, backups, and security best practices',
        category: 'DevOps & Cloud',
        location: 'Remote',
        jobType: 'Full-time',
        salaryMin: 65000,
        salaryMax: 98000,
        vacancies: 2,
        deadline: daysFromNow(32),
        createdAt: daysAgo(14),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'UI/UX Design Intern',
        description:
          'Collaborate with senior product designers to create wireframes, interactive prototypes, and clean Tailwind UI components.',
        requirements:
          '• Familiarity with Figma and modern web layout principles\n• Strong curiosity and eagerness to learn design systems',
        category: 'UI/UX Design',
        location: 'Dhaka',
        jobType: 'Internship',
        salaryMin: 14000,
        salaryMax: 20000,
        vacancies: 3,
        deadline: daysFromNow(29),
        createdAt: daysAgo(6),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'React Native Mobile App Developer',
        description:
          'Build smooth cross-platform iOS and Android companion apps integrated with our REST APIs.',
        requirements:
          '• Experience with React / React Native, state management, and RESTful API integration\n• Focus on smooth animations and offline resilience',
        category: 'Software Engineering',
        location: 'Sylhet',
        jobType: 'Contract',
        salaryMin: 50000,
        salaryMax: 80000,
        vacancies: 2,
        deadline: daysFromNow(23),
        createdAt: daysAgo(32),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'Technical Content Writer (Web & Cloud)',
        description:
          'Write developer documentation, API integration guides, and engineering blog tutorials.',
        requirements:
          '• Strong command of technical English and Markdown\n• Ability to explain JavaScript, REST APIs, and cloud concepts clearly',
        category: 'Marketing',
        location: 'Remote',
        jobType: 'Part-time',
        salaryMin: 20000,
        salaryMax: 32000,
        vacancies: 2,
        deadline: daysFromNow(26),
        createdAt: daysAgo(44),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'Full-Stack JavaScript Engineer (Remote)',
        description:
          'Develop end-to-end SaaS features from MongoDB schemas and Express controllers to polished React views.',
        requirements:
          '• Strong knowledge of MERN stack and modern ES6+ JavaScript\n• Self-motivated team player comfortable in remote workflows',
        category: 'Software Engineering',
        location: 'Remote',
        jobType: 'Remote',
        salaryMin: 60000,
        salaryMax: 92000,
        vacancies: 2,
        deadline: daysFromNow(31),
        createdAt: daysAgo(3),
      },
      {
        company: companies[2]._id,
        postedBy: employerUsers[2]._id,
        title: 'Cloud Solutions Architect (Part-time)',
        description:
          'Advise engineering squads on multi-tenant database scaling, caching strategies, and cost optimization.',
        requirements:
          '• Proven experience designing cloud-native web architectures\n• Deep knowledge of MongoDB aggregation, indexing, and Node.js scaling',
        category: 'DevOps & Cloud',
        location: 'Rajshahi',
        jobType: 'Part-time',
        salaryMin: 45000,
        salaryMax: 70000,
        vacancies: 1,
        deadline: daysFromNow(17),
        createdAt: daysAgo(58),
      },
    ];

    const createdJobs = await Job.insertMany(jobsData);

    // 5. Create Sample Applications across different statuses
    const sampleApplications = [
      {
        job: createdJobs[0]._id, // Full-Stack MERN Developer
        applicant: seekerUsers[0]._id, // Mahfuz
        resumePath: resumeUrl,
        coverNote:
          'I have built multiple full-stack web apps and portals using React, Vite, Tailwind CSS, Node.js, and MongoDB. Excited to contribute to TechNova Solutions BD!',
        status: 'Shortlisted',
        appliedAt: daysAgo(4),
      },
      {
        job: createdJobs[3]._id, // Cybersecurity & Penetration Testing Analyst
        applicant: seekerUsers[0]._id, // Mahfuz
        resumePath: resumeUrl,
        coverNote:
          'Certified Penetration Testing Engineer (C)PTE) with hands-on web security and full-stack development experience.',
        status: 'Accepted',
        appliedAt: daysAgo(7),
      },
      {
        job: createdJobs[7]._id, // Backend Node.js & Microservices Engineer
        applicant: seekerUsers[0]._id, // Mahfuz
        resumePath: resumeUrl,
        coverNote: 'Experienced in designing secure JWT REST APIs and Mongoose schemas.',
        status: 'Pending',
        appliedAt: daysAgo(2),
      },
      {
        job: createdJobs[0]._id,
        applicant: seekerUsers[1]._id, // Sajid
        resumePath: resumeUrl,
        coverNote: 'Strong backend and full-stack fundamentals from CSE coursework and lab projects.',
        status: 'Pending',
        appliedAt: daysAgo(3),
      },
      {
        job: createdJobs[7]._id,
        applicant: seekerUsers[1]._id, // Sajid
        resumePath: resumeUrl,
        coverNote: 'Focused on Node.js, Express, and database query optimization.',
        status: 'Shortlisted',
        appliedAt: daysAgo(5),
      },
      {
        job: createdJobs[1]._id, // Frontend React.js Engineer
        applicant: seekerUsers[2]._id, // Farhana
        resumePath: resumeUrl,
        coverNote: 'UI/UX designer and React developer with strong Tailwind CSS design system skills.',
        status: 'Accepted',
        appliedAt: daysAgo(6),
      },
      {
        job: createdJobs[9]._id, // Senior Product UI/UX Designer
        applicant: seekerUsers[2]._id, // Farhana
        resumePath: resumeUrl,
        coverNote: 'Attached portfolio and resume highlighting fintech dashboard redesigns.',
        status: 'Shortlisted',
        appliedAt: daysAgo(4),
      },
      {
        job: createdJobs[8]._id, // FinTech Data Analyst
        applicant: seekerUsers[3]._id, // Arif
        resumePath: resumeUrl,
        coverNote: 'Experienced in Python, SQL, and executive KPI visualization.',
        status: 'Pending',
        appliedAt: daysAgo(2),
      },
      {
        job: createdJobs[4]._id, // QA Automation Engineer
        applicant: seekerUsers[3]._id, // Arif
        resumePath: resumeUrl,
        coverNote: 'Detail-oriented analyst with API testing experience.',
        status: 'Rejected',
        appliedAt: daysAgo(9),
      },
      {
        job: createdJobs[14]._id, // DevOps & Cloud Infrastructure Engineer
        applicant: seekerUsers[4]._id, // Tasnim
        resumePath: resumeUrl,
        coverNote: 'Hands-on with Docker, GitHub Actions, and Linux cloud servers.',
        status: 'Shortlisted',
        appliedAt: daysAgo(3),
      },
    ];

    await Application.insertMany(sampleApplications);

    // 6. Create Sample Saved Jobs for Mahfuz & Sajid
    await ensureAdditionalJobs();

    await SavedJob.insertMany([
      { user: seekerUsers[0]._id, job: createdJobs[0]._id },
      { user: seekerUsers[0]._id, job: createdJobs[1]._id },
      { user: seekerUsers[0]._id, job: createdJobs[18]._id },
      { user: seekerUsers[1]._id, job: createdJobs[7]._id },
    ]);

    console.log('\n✅ HireSphere Database Seeded Successfully!');
    console.log('===============================================================');
    console.log('🔐 DEMO LOGIN CREDENTIALS');
    console.log('---------------------------------------------------------------');
    console.log('👑 ADMIN      : admin@hiresphere.com        | Admin@123');
    console.log('🏢 EMPLOYER 1 : hr@technovabd.com           | Employer@123 (Verified)');
    console.log('🏢 EMPLOYER 2 : careers@finpulseltd.com     | Employer@123 (Verified)');
    console.log('🏢 EMPLOYER 3 : talent@cloudforge.io        | Employer@123 (Unverified)');
    console.log('👩‍💻 SEEKER 1   : mahfuz@hiresphere.com       | Seeker@123');
    console.log('👨‍💻 SEEKER 2   : sajid@hiresphere.com        | Seeker@123');
    console.log('👩‍💻 SEEKER 3   : farhana@hiresphere.com      | Seeker@123');
    console.log('===============================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error);
    process.exit(1);
  }
};

seedDatabase();
