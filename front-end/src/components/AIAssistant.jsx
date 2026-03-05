import React, { useState, useEffect } from "react";
import "./AIAssistant.css";

export const ROLE_TEMPLATES = {
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
    "full stack developer": {
        summary: [
            "Versatile Full Stack Developer with expertise in React, Node.js, and cloud ecosystems. Skilled in building end-to-end applications that prioritize user experience and system performance.",
            "Dynamic engineer proficient in both frontend and backend technologies, specializing in scalable architectures and efficient API design.",
            "Solution-oriented developer with a strong focus on clean code, automated testing, and seamless DevOps integration."
        ],
        experience: [
            "Architected and deployed a highly scalable SaaS platform using React, Node.js, and AWS, handling 200k+ concurrent users.",
            "Streamlined cross-platform synchronization, reducing data latency by 60% across web and mobile applications.",
            "Implemented robust security protocols and OAuth2 authentication, achieving 100% compliance with industry standards."
        ]
    },
    "ui/ux designer": {
        summary: [
            "User-Centric UI/UX Designer with a passion for creating intuitive, visually stunning digital experiences. Expert in Figma, Adobe XD, and user research.",
            "Creative professional dedicated to bridging the gap between business goals and user needs through empathetic design and data-driven insights.",
            "Detail-oriented designer specializing in design systems, high-fidelity prototyping, and accessibility-first interfaces."
        ],
        experience: [
            "Redesigned the core product interface, resulting in a 35% increase in user retention and a 20% boost in task completion speed.",
            "Established a comprehensive Design System that improved developer handoff efficiency by 50%.",
            "Conducted extensive usability testing with 100+ participants to identify and resolve critical navigation friction points."
        ]
    },
    "backend developer": {
        summary: [
            "Backend specialist with deep expertise in Node.js, Python, and SQL/NoSQL databases. Focused on building high-performance server-side logic.",
            "Efficiency-driven engineer specializing in microservices, system optimization, and high-availability architectures.",
            "Expert in API development and database management, with a strong focus on security, scalability, and clean modular code."
        ],
        experience: [
            "Optimized database queries and indexing strategies, reducing server response time by 75% for high-traffic endpoints.",
            "Developed a robust microservices architecture that enabled independent scaling of 10+ core business modules.",
            "Integrated real-time data processing systems using Redis and Kafka, processing 50M+ events daily with zero downtime."
        ]
    },
    "frontend developer": {
        summary: [
            "Frontend specialist passionate about crafting responsive, performant, and accessible web interfaces using React and modern CSS.",
            "UI-focused developer with an eye for detail and a commitment to high-performance rendering and smooth user interactions.",
            "Expert in building scalable component libraries and complex state management systems to power modern web applications."
        ],
        experience: [
            "Improved vitals scores (LCP, CLS) by 40% through advanced asset optimization and lazy-loading techniques.",
            "Led the development of a reusable UI component library used across 15+ company projects, ensuring brand consistency.",
            "Implemented intricate animations and transitions using Framer Motion, enhancing the overall user experience rating by 15%."
        ]
    },
    "mobile app developer": {
        summary: [
            "Mobile App Developer with expertise in React Native, Flutter, and native mobile ecosystems. Focused on cross-platform excellence.",
            "Versatile developer specializing in high-performance iOS and Android applications with a single codebase philosophy.",
            "Creative engineer dedicated to bringing complex ideas to life on mobile devices with smooth performance and native-like experiences."
        ],
        experience: [
            "Launched a top-rated mobile application with 500k+ downloads and a 4.8-star average rating on both App Store and Play Store.",
            "Optimized app startup time by 50% and reduced bundle size by 30% through modular architecture and tree-shaking.",
            "Integrated complex features including push notifications, real-time sync, and location-based services."
        ]
    }
};

const AI_SUGGESTIONS = {
    summary: [
        "Results-driven [Title] with a proven track record of delivering high-quality solutions in the technology sector.",
        "Adaptable and innovative [Title] with expertise in modern frameworks. Committed to professional excellence and growth.",
        "Highly motivated [Title] skilled in problem-solving and strategic planning. Dedicated to continuous learning.",
        "Dynamic [Title] with extensive experience in streamlining processes and driving business impact through technical excellence."
    ],
    experience: [
        "Steered high-impact initiatives, resulting in a [Percentage]% increase in overall team productivity and output.",
        "Integrated modern technologies to streamline complex workflows, saving the company [Number] hours per week in manual labor.",
        "Spearheaded the development of core systems, which enhanced user engagement metrics by [Percentage]% over 6 months.",
        "Resolved critical technical bottlenecks, reducing performance issues and customer churn by [Percentage]%."
    ],
    projects: [
        "Engineered a high-performance [Project Type] using modern tech stacks that solved critical business automation challenges.",
        "Designed a scalable [System Name] optimized for high-load scenarios and low-latency response times.",
        "Launched an innovative platform that automates complex tasks, gaining significant positive feedback and user adoption.",
        "Developed a robust application leveraging real-time APIs for data processing and intelligent decision making."
    ]
};

const AIAssistant = ({ field, currentData, onApply }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [typingText, setTypingText] = useState({});

    const generateSuggestions = () => {
        const title = (currentData.title || "").toLowerCase();
        setLoading(true);
        setIsOpen(true);
        setTypingText({});

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
                .map(s => s.replace(/\[Percentage\]/g, "30"))
                .map(s => s.replace(/\[Number\]/g, "15"))
                .slice(0, 2);

            results = [...results, ...generic];

            setSuggestions(results);
            setLoading(false);

            // Start typing effect for each suggestion
            results.forEach((s, idx) => {
                let current = "";
                const chars = s.split("");
                let i = 0;
                const interval = setInterval(() => {
                    if (i < chars.length) {
                        current += chars[i];
                        setTypingText(prev => ({ ...prev, [idx]: current }));
                        i++;
                    } else {
                        clearInterval(interval);
                    }
                }, 15);
            });
        }, 1200);
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
                                    <div key={i} className="suggestion-item animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                        <div className="suggestion-text">
                                            {typingText[i] || ""}
                                            <span className="typing-cursor">|</span>
                                        </div>
                                        <button className="apply-btn" onClick={() => handleApply(s)}>Use this idea</button>
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
