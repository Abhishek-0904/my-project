import React, { useState, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';
import useResume from '../pages/resumecontext';
import './CoverLetterGenerator.css';

const CoverLetterGenerator = ({ profiles }) => {
    const { showToast } = useResume();
    const [selectedProfileId, setSelectedProfileId] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [generating, setGenerating] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Sync selectedProfileId when profiles load
    useEffect(() => {
        if (profiles.length > 0 && !selectedProfileId) {
            setSelectedProfileId(profiles[0]._id);
        }
    }, [profiles]);

    const typeEffect = (fullText) => {
        setIsTyping(true);
        setGeneratedLetter('');
        let i = 0;
        const interval = setInterval(() => {
            setGeneratedLetter((prev) => prev + fullText.charAt(i));
            i++;
            if (i >= fullText.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 15); // Faster typing
    };

    const generateLetter = () => {
        const profile = profiles.find(p => p._id === selectedProfileId);
        if (!profile) return;

        setGenerating(true);
        setGeneratedLetter('');

        setTimeout(() => {
            const data = profile.data || {};
            const today = new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });

            // Extract best achievements
            const majorProject = data.projects?.[0]?.title || "recent technical projects";
            const topExperience = data.experience?.[0] || {};
            const role = data.title || "Professional";
            const company = companyName || "[Target Company]";

            // Generate Role-Specific Content
            let motivation = `your company's reputation for innovation and market leadership`;
            let closingPitch = `I am eager to contribute my technical expertise and problem-solving skills to ${company}.`;

            if (role.toLowerCase().includes("developer") || role.toLowerCase().includes("engineer")) {
                motivation = `your commitment to leveraging cutting-edge technology to solve complex problems`;
                closingPitch = `I am excited about the possibility of building scalable solutions and contributing to your technical roadmap.`;
            } else if (role.toLowerCase().includes("designer")) {
                motivation = `the exceptional visual-first approach and design philosophy at ${company}`;
                closingPitch = `I look forward to the opportunity of elevating your brand's visual identity with my creative perspective.`;
            } else if (role.toLowerCase().includes("manager") || role.toLowerCase().includes("lead")) {
                motivation = `your efficient operational framework and your focus on sustainable business growth`;
                closingPitch = `I am ready to lead high-performance teams and drive strategic initiatives at your organization.`;
            }

            const letter = `
${data.name}
${data.address || ''} | ${data.phone || ''}
${data.email}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}

${today}

To: The Recruitment Team
Company: ${company}

RE: Application for the Position of ${role}

Dear Hiring Manager,

I am writing to formally submit my application for the ${role} position at ${company}. Having followed ${company}'s growth for some time, I am deeply impressed by ${motivation}. I believe my background in ${data.skills ? data.skills.split(',')[0] : 'modern industry practices'} and my commitment to excellence align perfectly with your team’s culture.

Currently, as a ${role}, I have honed my ability to deliver results in high-pressure environments. ${data.summary ? data.summary : `Throughout my career, I have consistently focused on optimizing performance and output.`}

A significant milestone in my professional journey was my contribution at ${topExperience.company || 'my recent workplace'}, where I was responsible for ${topExperience.description ? topExperience.description.split('.')[0].toLowerCase() : 'driving key project deliverables'}. Furthermore, my work on "${majorProject}" demonstrates my proficiency in ${data.skills ? data.skills.split(',').slice(0, 3).join(', ') : 'core technical domains'}.

What sets me apart is my ability to translate complex ${role.includes('Developer') ? 'technical requirements' : 'business needs'} into actionable strategies. I am particularly motivated to join ${company} because I thrive in environments that challenge the status quo and push for continuous improvement.

${closingPitch}

Thank you for considering my application. I have attached my resume, which provides more detail on my accomplishments and skills. I look forward to the possibility of discussing how my experience can benefit ${company} in a future interview.

Best Regards,

${data.name}
`.trim();

            setGenerating(false);
            typeEffect(letter);
        }, 1200);
    };

    const copyToClipboard = () => {
        if (!generatedLetter) return;
        navigator.clipboard.writeText(generatedLetter);
        showToast("Cover letter copied to clipboard!", "success");
    };

    return (
        <div className="ud-cl-container">
            <div className="ud-cl-tools">
                <div className="cl-input-group">
                    <div className="ud-form-group">
                        <label>Select Resume Profile</label>
                        <CustomDropdown
                            options={profiles.map(p => ({ label: p.title, value: p._id }))}
                            value={selectedProfileId}
                            onChange={(val) => setSelectedProfileId(val)}
                            placeholder={profiles.length === 0 ? "No profiles found" : "Select a profile"}
                        />
                    </div>

                    <div className="ud-form-group">
                        <label>Target Company</label>
                        <input
                            type="text"
                            className="ud-input-v2"
                            placeholder="e.g. Google, Apple"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    className={`ud-save-profile-btn ${generating || isTyping ? 'loading' : ''}`}
                    onClick={generateLetter}
                    disabled={generating || isTyping || !selectedProfileId}
                >
                    {generating ? (
                        <span className="spinner-small"></span>
                    ) : isTyping ? (
                        "✨ AI is Writing..."
                    ) : (
                        "✨ Write Professional Letter"
                    )}
                </button>
            </div>

            {(generatedLetter || generating) && (
                <div className={`ud-cl-result animate-in ${isTyping ? 'is-writing' : ''}`}>
                    <div className="cl-result-header">
                        <h3>Generated Cover Letter</h3>
                        <div className="cl-header-actions">
                            {isTyping && <span className="ai-typing-indicator">AI is writing...</span>}
                            <button className="cl-copy-btn" onClick={copyToClipboard} disabled={isTyping}>
                                📋 Copy text
                            </button>
                        </div>
                    </div>
                    {generating ? (
                        <div className="cl-loading-skeleton">
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line short"></div>
                            <div className="skeleton-line"></div>
                        </div>
                    ) : (
                        <textarea
                            className="cl-textarea"
                            value={generatedLetter}
                            onChange={(e) => setGeneratedLetter(e.target.value)}
                            spellCheck="false"
                        />
                    )}
                    {!isTyping && generatedLetter && (
                        <p className="cl-tip">✨ You can now edit the text or copy it to your document.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CoverLetterGenerator;
