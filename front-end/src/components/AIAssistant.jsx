import React, { useState, useEffect } from "react";
import "./AIAssistant.css";

const ROLE_TEMPLATES = {
    "web developer": {
        summary: [
            "Full-stack Web Developer with expertise in React, Node.js, and modern web architectures. Passionate about building scalable and user-centric applications.",
            "Front-end specialist focused on creating high-performance, responsive web interfaces with a deep understanding of UI/UX principles.",
            "Detail-oriented developer with a strong foundation in Javascript and backend integration. Experienced in agile environments."
        ],
        experience: [
            "Optimized web application performance by 40% through code refactoring and advanced caching strategies.",
            "Developed and maintained responsive user interfaces using React and Redux, serving over 100k+ monthly active users.",
            "Led the migration of legacy codebase to a modern Microservices architecture, improving deployment speed by 2x."
        ]
    },
    "software engineer": {
        summary: [
            "Software Engineer with a strong background in algorithm design and system optimization. Expert in Java, C++, and Python.",
            "Driven engineer specializing in backend systems and cloud infrastructure. Committed to writing clean, maintainable code.",
            "Versatile software professional with experience in full-cycle development and cross-platform mobile solutions."
        ],
        experience: [
            "Designed and implemented a distributed processing system that handled 1M+ transactions daily.",
            "Reduced system downtime by 35% by implementing automated testing and CI/CD pipelines.",
            "Collaborated on the development of a secure API layer using OAuth2 and enterprise-grade security protocols."
        ]
    },
    "graphic designer": {
        summary: [
            "Creative Graphic Designer with 5+ years of experience in brand identity, digital marketing, and typography. Expert in Adobe Creative Suite.",
            "Visual storyteller dedicated to crafting compelling designs that elevate brand presence and engage target audiences.",
            "Versatile designer with a background in both print and digital media, specializing in modern, minimalist aesthetics."
        ],
        experience: [
            "Executed end-to-end design for the company's major rebranding campaign, increasing brand recognition by 25%.",
            "Created high-impact social media assets and ad campaigns that resulted in a 15% boost in click-through rates.",
            "Collaborated with marketing teams to produce high-quality print materials and interactive digital prototypes."
        ]
    },
    "data scientist": {
        summary: [
            "Data Scientist with expertise in machine learning, statistical modeling, and big data analytics. Expert in Python, R, and SQL.",
            "Insight-driven professional specializing in predictive modeling and data visualization to drive strategic decision-making.",
            "Quantitative researcher with a focus on deep learning architectures and NLP solutions."
        ],
        experience: [
            "Developed a churn prediction model with 92% accuracy, helping the company reduce attrition by 15%.",
            "Built automated data pipelines in AWS, reducing manual data processing time by 80%.",
            "Presented key data insights to stakeholders that led to a $2M increase in annual marketing efficiency."
        ]
    },
    "sales executive": {
        summary: [
            "Results-oriented Sales Executive with a proven track record of exceeding targets and building long-term client relationships.",
            "Persuasive communicator specializing in B2B sales, market expansion, and strategic lead generation.",
            "High-energy sales professional with expertise in CRM management and closing complex high-value deals."
        ],
        experience: [
            "Exceeded annual sales quota by 140%, generating $1.5M in new business revenue.",
            "Expanded market presence into 3 new territories, acquiring 50+ enterprise-level clients.",
            "Streamlined the sales funnel process, increasing conversion rates from lead to close by 20%."
        ]
    },
    "marketing manager": {
        summary: [
            "Strategic Marketing Manager with a track record of driving growth through data-driven campaigns and market analysis.",
            "Result-oriented professional focused on digital marketing, SEO, and content strategy to maximize ROI.",
            "Dynamic leader skilled in brand positioning, cross-functional collaboration, and multi-channel campaign management."
        ],
        experience: [
            "Increased organic website traffic by 60% within 6 months through a comprehensive SEO and content strategy overhaul.",
            "Managed a marketing budget of $50k+, delivering 20% year-over-year revenue growth.",
            "Directed the launch of 5 new products across global markets, exceeding initial sales targets by 30%."
        ]
    },
    "human resources": {
        summary: [
            "HR Professional dedicated to talent acquisition, employee engagement, and organizational development.",
            "People-centric HR Manager with expertise in policy implementation, conflict resolution, and performance management.",
            "Strategic recruiter focused on building high-performance teams and fostering an inclusive company culture."
        ],
        experience: [
            "Reduced time-to-hire by 30% by implementing a new Applicant Tracking System (ATS).",
            "Designed and launched an employee wellness program that increased retention rates by 20%.",
            "Oversaw the recruitment of 100+ employees across 5 departments for a rapid-growth startup."
        ]
    },
    "teacher": {
        summary: [
            "Dedicated Educator with a passion for student development and innovative teaching methodologies.",
            "Academic professional specializing in curriculum design and personalized learning strategies.",
            "Experienced teacher committed to creating an engaging and inclusive classroom environment."
        ],
        experience: [
            "Increased student test scores by 25% through the implementation of interactive digital learning tools.",
            "Developed a common-core-aligned curriculum for the Science department, adopted by the entire school district.",
            "Mentored a group of 30+ students in extra-curricular research projects, winning 5 national level awards."
        ]
    },
    "accountant": {
        summary: [
            "Detail-oriented Accountant with expertise in financial reporting, tax compliance, and auditing.",
            "Financial professional specializing in budget analysis, cost reduction, and GAAP standards.",
            "CPA-focused accountant with a strong background in corporate finance and ERP systems like SAP/Oracle."
        ],
        experience: [
            "Managed a portfolio of assets worth $10M+, ensuring 100% compliance with federal tax regulations.",
            "Identified $200k in annual cost savings through a thorough audit of operational expenses.",
            "Automated the month-end closing process, reducing cycles from 10 days to 4 days."
        ]
    },
    "project manager": {
        summary: [
            "PMP-certified Project Manager with a focus on agile methodologies and cross-functional team leadership.",
            "Strategic leader experienced in managing multi-million dollar projects from inception to completion.",
            "Operations focused PM specializing in risk management, resource allocation, and stakeholder communication."
        ],
        experience: [
            "Successfully delivered a $5M infrastructure project 2 months ahead of schedule.",
            "Implemented Agile/Scrum practices that improved team velocity by 40% within 2 quarters.",
            "Managed a global team of 50+ developers, designers, and QA engineers across 3 time zones."
        ]
    }
};

const AI_SUGGESTIONS = {
    summary: [
        "Results-driven [Title] with a proven track record of delivering high-quality solutions in [Industry].",
        "Adaptable and innovative [Title] with expertise in [Core Skill]. Committed to professional excellence.",
        "Highly motivated [Title] skilled in [Skill1] and [Skill2]. Dedicated to continuous learning and growth.",
        "Dynamic [Title] with [Years]+ years of experience. Expertise in [Process] to drive business results."
    ],
    experience: [
        "Steered [Project Name], resulting in a [Percentage]% increase in team productivity.",
        "Integrated [Technology] to streamline workflows, saving [Number] hours per week.",
        "Spearheaded the development of [System], which enhanced user engagement by [Percentage]%.",
        "Resolved complex technical issues for [Product], reducing customer churn by [Percentage]%."
    ],
    projects: [
        "Engineered a [Project Type] using [Tech Stack] that solves [Problem].",
        "Designed a scalable [System Name] optimized for [Performance/Load].",
        "Launched an innovative [Tool Name] that automates [Task], gaining positive feedback from users.",
        "Developed a robust [Application] leveraging [AI/API] for real-time data processing."
    ]
};

const AIAssistant = ({ field, currentData, onApply }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const generateSuggestions = () => {
        const title = (currentData.title || "").toLowerCase();
        setLoading(true);
        setIsOpen(true);

        setTimeout(() => {
            let results = [];

            // 1. Check for specific role templates first
            const matchedRoleKey = Object.keys(ROLE_TEMPLATES).find(role => title.includes(role));

            if (matchedRoleKey && ROLE_TEMPLATES[matchedRoleKey][field]) {
                results = [...ROLE_TEMPLATES[matchedRoleKey][field]];
            }

            // 2. Add generic templates with title replacement
            const displayTitle = currentData.title || "Professional";
            const generic = (AI_SUGGESTIONS[field] || [])
                .map(s => s.replace(/\[Title\]/g, displayTitle))
                .map(s => s.replace(/\[Industry\]/g, "the industry"))
                .slice(0, 2); // Only take 2 generic ones if we have specific ones

            results = [...results, ...generic];

            setSuggestions(results);
            setLoading(false);
        }, 800);
    };

    const handleApply = (text) => {
        onApply(text);
        setIsOpen(false);
    };

    return (
        <div className="ai-assistant-wrapper">
            <button
                className="ai-magic-btn"
                onClick={generateSuggestions}
                title="AI Writing Assistant"
            >
                <span className="ai-icon">✨</span>
                <span className="ai-text">AI Help</span>
            </button>

            {isOpen && (
                <div className="ai-suggestion-panel">
                    <div className="panel-header">
                        <h4><span className="ai-icon">✨</span> AI Suggestion for {field}</h4>
                        <button className="close-panel" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="panel-content">
                        {loading ? (
                            <div className="ai-loading">
                                <div className="ai-spinner"></div>
                                <p>Generating professional ideas...</p>
                            </div>
                        ) : (
                            <div className="suggestions-list">
                                {suggestions.map((s, i) => (
                                    <div key={i} className="suggestion-item">
                                        <p>{s}</p>
                                        <button className="apply-btn" onClick={() => handleApply(s)}>Use this</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="panel-footer">
                        <p>Tip: You can edit the text after applying it.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
