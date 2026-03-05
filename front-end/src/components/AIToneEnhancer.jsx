import React, { useState } from "react";
import "./AIToneEnhancer.css";

const TONE_TEMPLATES = {
    summary: {
        professional: [
            "Results-oriented professional with a proven track record in [Title]. Strategic thinker with expertise in streamlining operations and driving growth.",
            "Experienced [Title] dedicated to excellence and continuous improvement. Expert in leading cross-functional teams and managing complex projects."
        ],
        creative: [
            "Passionate storyteller and [Title] blending innovation with strategic execution. Crafting unique digital experiences that resonate.",
            "Dynamic [Title] with a flair for creative problem solving and a vision for future-forward solutions."
        ],
        action: [
            "High-impact [Title] known for delivering measurable results. Spearheaded key initiatives that increased efficiency by 30%.",
            "Decisive leader with extensive experience in accelerating project timelines and optimizing resource allocation."
        ]
    },
    experience: {
        professional: [
            "Successfully managed key account relationships, ensuring long-term satisfaction and strategic alignment.",
            "Delivered comprehensive project reports that informed executive decision-making and project prioritization."
        ],
        creative: [
            "Reimagined customer touchpoints to create a more engaging and seamless brand journey.",
            "Pioneered a new visual language for internal communications, boosting employee engagement by 20%."
        ],
        action: [
            "Generated $500k in new revenue by identifying and capturing untapped market opportunities.",
            "Reduced operational costs by 15% through the implementation of automated tracking systems."
        ]
    }
};

const AIToneEnhancer = ({ text, type, title, onApply }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedTone, setSelectedTone] = useState("professional");

    const enhanceText = (tone) => {
        setSelectedTone(tone);
        setLoading(true);
        setIsOpen(true);

        setTimeout(() => {
            const displayTitle = title || "Professional";
            const templates = TONE_TEMPLATES[type]?.[tone] || [];

            const results = templates.map(t => t.replace(/\[Title\]/g, displayTitle));
            setOptions(results);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="ai-tone-enhancer">
            <button
                className="tone-btn"
                onClick={() => setIsOpen(!isOpen)}
                title="AI Tone Enhancer"
            >
                🪄 Tone
            </button>

            {isOpen && (
                <div className="tone-panel animate-in">
                    <div className="tone-header">
                        <span>✨ Change Tone</span>
                        <button onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="tone-selector">
                        {['professional', 'creative', 'action'].map(t => (
                            <button
                                key={t}
                                className={selectedTone === t ? 'active' : ''}
                                onClick={() => enhanceText(t)}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="tone-content">
                        {loading ? (
                            <div className="tone-loading">Processing...</div>
                        ) : (
                            <div className="tone-options">
                                {options.length > 0 ? options.map((opt, i) => (
                                    <div key={i} className="tone-option-item">
                                        <p>{opt}</p>
                                        <button onClick={() => {
                                            onApply(opt);
                                            setIsOpen(false);
                                        }}>Apply</button>
                                    </div>
                                )) : (
                                    <p className="tone-placeholder">Select a tone to see suggestions</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIToneEnhancer;
