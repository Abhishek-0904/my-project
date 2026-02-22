import React, { useState, useEffect } from 'react';
import './ResumeTipsWidget.css';

const ResumeTipsWidget = ({ resumeData }) => {
    const [tips, setTips] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        analyzeResume(resumeData);
    }, [resumeData]);

    const analyzeResume = (data) => {
        const newTips = [];

        // 1. Contact Info Checks
        if (!data.phone) newTips.push({ id: 'phone', text: 'Add a phone number so recruiters can reach you.', priority: 'high' });
        if (!data.linkedin) newTips.push({ id: 'linkedin', text: 'LinkedIn profiles increase trust by 40%.', priority: 'medium' });
        if (!data.address) newTips.push({ id: 'address', text: 'Adding your location/city helps in local hiring.', priority: 'low' });

        // 2. Summary Checks
        if (!data.summary) {
            newTips.push({ id: 'summary_none', text: 'A professional summary is essential for a great first impression.', priority: 'high' });
        } else if (data.summary.length < 100) {
            newTips.push({ id: 'summary_short', text: 'Your summary is a bit short. Try adding more about your goals.', priority: 'medium' });
        }

        // 3. Experience & Projects
        if (!data.experience || data.experience.length === 0 || !data.experience[0].company) {
            newTips.push({ id: 'exp', text: 'List at least one work experience to show your background.', priority: 'high' });
        }

        if (!data.projects || data.projects.length === 0 || !data.projects[0].title) {
            newTips.push({ id: 'projects', text: 'Projects are great for showing practical skills. Add one!', priority: 'medium' });
        }

        // 4. Skills
        if (!data.skills || data.skills.split(',').length < 3) {
            newTips.push({ id: 'skills', text: 'Add at least 5 key skills for better ATS ranking.', priority: 'high' });
        }

        // 5. Image Check
        if (!data.profileImage) {
            newTips.push({ id: 'image', text: 'A professional photo makes your resume more personal.', priority: 'low' });
        }

        setTips(newTips);
    };

    const highPriorityCount = tips.filter(t => t.priority === 'high').length;

    return (
        <div className={`resume-tips-widget ${isOpen ? 'open' : ''} ${tips.length === 0 ? 'all-done' : ''}`}>
            <button className="tips-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                <span className="tips-icon">💡</span>
                <span className="tips-badge">{tips.length}</span>
                <span className="tips-text">Resume Score & Tips</span>
            </button>

            {isOpen && (
                <div className="tips-panel animate-in">
                    <div className="tips-header">
                        <h4>🔍 Smart Analysis</h4>
                        <button className="close-tips" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="score-section">
                        <div className="score-circle">
                            <div className="score-value">{Math.max(0, 100 - (tips.length * 10))}%</div>
                            <div className="score-label">Resume Strength</div>
                        </div>
                    </div>

                    <div className="tips-list">
                        {tips.length === 0 ? (
                            <div className="all-clear">
                                <span className="check-icon">✅</span>
                                <p>Your resume looks perfect! You're ready to apply.</p>
                            </div>
                        ) : (
                            tips.map(tip => (
                                <div key={tip.id} className={`tip-item ${tip.priority}`}>
                                    <span className="priority-dot"></span>
                                    <p>{tip.text}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {highPriorityCount > 0 && (
                        <div className="tips-footer">
                            <p>You have {highPriorityCount} critical improvements pending.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResumeTipsWidget;
