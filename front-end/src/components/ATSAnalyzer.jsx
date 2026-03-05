import { useState, useMemo } from 'react';
import './ATSAnalyzer.css';

const COMMON_STOP_WORDS = new Set(['and', 'or', 'the', 'is', 'at', 'with', 'for', 'from', 'managing', 'working', 'using', 'strong', 'excellent', 'proven', 'highly', 'skilled', 'focused', 'experience', 'ability', 'familiar', 'knowledge', 'plus', 'preferred', 'required', 'must', 'have', 'years', 'working', 'tools', 'understanding', 'principles', 'best', 'practices']);

export default function ATSAnalyzer({ resumeData, updateResume }) {
    const [isOpen, setIsOpen] = useState(false);

    const analysis = useMemo(() => {
        if (!resumeData.jobDescription) return null;

        // 1. Extract potential keywords from JD (simple freq count and cleanup)
        const jdWords = resumeData.jobDescription.toLowerCase()
            .split(/[\s,./()\-]+/)
            .filter(w => w.length > 3 && !COMMON_STOP_WORDS.has(w));

        // Most frequent 20 words as potential keywords
        const jdCounts = {};
        jdWords.forEach(w => jdCounts[w] = (jdCounts[w] || 0) + 1);
        const sortedJdWords = Object.entries(jdCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(e => e[0]);

        // 2. Extract words from Resume
        const resumeTexts = [
            resumeData.title,
            resumeData.summary,
            resumeData.skills,
            ...(resumeData.experience || []).map(e => `${e.role} ${e.description}`),
            ...(resumeData.projects || []).map(p => `${p.title} ${p.description}`)
        ].join(' ').toLowerCase();

        const matched = [];
        const missing = [];

        sortedJdWords.forEach(word => {
            if (resumeTexts.includes(word)) {
                matched.push(word);
            } else {
                missing.push(word);
            }
        });

        const matchPercent = Math.round((matched.length / sortedJdWords.length) * 100);

        return { matched, missing, matchPercent };
    }, [resumeData.jobDescription, resumeData.experience, resumeData.projects, resumeData.skills, resumeData.summary]);

    return (
        <div className={`ats-analyzer-card ${isOpen ? 'open' : ''}`}>
            <div className="ats-header" onClick={() => setIsOpen(!isOpen)}>
                <div className="ats-title-row">
                    <span className="ats-icon">🚀</span>
                    <div className="ats-text">
                        <h4>ATS Optimizer</h4>
                        <p>Match your resume to a job</p>
                    </div>
                </div>
                <div className="ats-score-badge" style={{
                    background: analysis ? (analysis.matchPercent > 70 ? '#22c55e' : analysis.matchPercent > 40 ? '#f59e0b' : '#ef4444') : '#94a3b8'
                }}>
                    {analysis ? `${analysis.matchPercent}%` : '--'}
                </div>
            </div>

            {isOpen && (
                <div className="ats-content">
                    <div className="jd-input-group">
                        <label>Target Role (Title)</label>
                        <input
                            type="text"
                            placeholder="e.g. Senior Frontend Developer"
                            value={resumeData.targetRole || ''}
                            onChange={(e) => updateResume('targetRole', e.target.value)}
                        />

                        <label>Job Description</label>
                        <textarea
                            placeholder="Paste the Job Description here..."
                            value={resumeData.jobDescription || ''}
                            onChange={(e) => updateResume('jobDescription', e.target.value)}
                            rows={4}
                        />
                    </div>

                    {analysis && (
                        <div className="analysis-results animate-in">
                            <div className="results-grid">
                                <div className="res-column">
                                    <h5>Matched Keywords ✅</h5>
                                    <div className="keyword-tags">
                                        {analysis.matched.map(w => <span key={w} className="tag matched">{w}</span>)}
                                        {analysis.matched.length === 0 && <p className="empty-hint">No matches yet</p>}
                                    </div>
                                </div>
                                <div className="res-column">
                                    <h5>Missing Keywords 🔍</h5>
                                    <div className="keyword-tags">
                                        {analysis.missing.map(w => <span key={w} className="tag missing">{w}</span>)}
                                        {analysis.missing.length === 0 && <p className="empty-hint">All keywords matched!</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="optimization-tip">
                                <strong>Tip:</strong> Adding missing keywords to your "Summary" or "Experience" naturally will increase your ATS score!
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
