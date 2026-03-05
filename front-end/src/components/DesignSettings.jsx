import React, { useState } from 'react';
import './DesignSettings.css';

const FONTS = [
    { name: 'Inter', family: 'Inter' },
    { name: 'Roboto', family: 'Roboto' },
    { name: 'Playfair Display', family: 'Playfair Display' },
    { name: 'Montserrat', family: 'Montserrat' },
    { name: 'Lora', family: 'Lora' },
    { name: 'Open Sans', family: 'Open Sans' },
    { name: 'Lato', family: 'Lato' },
];

const PRESETS = [
    {
        id: 'modern',
        name: 'Modern Pro',
        icon: '💼',
        settings: {
            fontFamily: 'Inter',
            profileFont: 'Montserrat',
            summaryFont: 'Lora',
            experienceTitleFont: 'Montserrat',
            sectionHeadingFont: 'Montserrat',
            headerAlignment: 'left',
            iconStyle: 'border',
            sectionTitleStyle: 'full-underline',
            bulletPointStyle: 'dot',
            experienceStyle: 'timeline',
            skillsStyle: 'progress'
        }
    },
    {
        id: 'executive',
        name: 'Executive',
        icon: '🏛️',
        settings: {
            fontFamily: 'Lora',
            profileFont: 'Playfair Display',
            summaryFont: 'Lora',
            experienceTitleFont: 'Playfair Display',
            sectionHeadingFont: 'Playfair Display',
            layoutMode: 'double',
            headerAlignment: 'center',
            iconStyle: 'fill',
            sectionTitleStyle: 'underline',
            bulletPointStyle: 'square',
            experienceStyle: 'classic',
            skillsStyle: 'dots'
        }
    },
    {
        id: 'creative',
        icon: '🎨',
        name: 'Creative',
        settings: {
            fontFamily: 'Montserrat',
            profileFont: 'Montserrat',
            summaryFont: 'Inter',
            experienceTitleFont: 'Montserrat',
            sectionHeadingFont: 'Montserrat',
            layoutMode: 'mix',
            headerAlignment: 'left',
            iconStyle: 'border',
            sectionTitleStyle: 'background-shade',
            bulletPointStyle: 'checkmark',
            experienceStyle: 'timeline',
            skillsStyle: 'badges'
        }
    },
    {
        id: 'dark-pro',
        name: 'Dark Executive',
        icon: '🌙',
        settings: {
            fontFamily: 'Roboto',
            pageBackground: '#1e293b',
            textColor: '#f8fafc',
            profileFont: 'Montserrat',
            summaryFont: 'Lora',
            experienceTitleFont: 'Montserrat',
            sectionHeadingFont: 'Montserrat',
            layoutMode: 'single',
            headerAlignment: 'left',
            iconStyle: 'border',
            sectionTitleStyle: 'side-border',
            bulletPointStyle: 'arrow',
            bulletPointColor: '#6366f1',
            experienceStyle: 'timeline',
            skillsStyle: 'progress',
            iconsOnly: true
        }
    }
];

const DesignSettings = ({ settings, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('general');

    const handleChange = (field, value) => {
        onUpdate({ ...settings, [field]: value });
    };

    const FontSelector = ({ value, onSelect, label }) => (
        <div className="design-group">
            <label>{label || 'Font Family'}</label>
            <div className="font-grid">
                {FONTS.map(font => (
                    <button
                        key={font.family}
                        className={`font-btn ${value === font.family ? 'active' : ''}`}
                        style={{ fontFamily: font.family }}
                        onClick={() => onSelect(font.family)}
                    >
                        {font.name}
                    </button>
                ))}
            </div>
        </div>
    );

    const handlePresetSelect = (preset) => {
        onUpdate({ ...settings, ...preset.settings });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'themes':
                return (
                    <div className="themes-grid animate-in">
                        {PRESETS.map(preset => (
                            <div
                                key={preset.id}
                                className={`preset-card ${settings.fontFamily === preset.settings.fontFamily && settings.layoutMode === preset.settings.layoutMode ? 'active' : ''}`}
                                onClick={() => handlePresetSelect(preset)}
                            >
                                <span className="preset-icon">{preset.icon}</span>
                                <span className="preset-name">{preset.name}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'general':
                return (
                    <>
                        <FontSelector label="Global/Body Font" value={settings.fontFamily} onSelect={(val) => handleChange('fontFamily', val)} />
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Base Text Size</label>
                                <span>{settings.fontSize}px</span>
                            </div>
                            <input type="range" min="10" max="18" value={settings.fontSize} onChange={(e) => handleChange('fontSize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Page Padding</label>
                                <span>{settings.pagePadding}px</span>
                            </div>
                            <input type="range" min="0" max="80" step="5" value={settings.pagePadding} onChange={(e) => handleChange('pagePadding', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Gap Between Sections</label>
                                <span>{settings.sectionSpacing}px</span>
                            </div>
                            <input type="range" min="5" max="80" step="5" value={settings.sectionSpacing} onChange={(e) => handleChange('sectionSpacing', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Global Scale</label>
                                <span>{settings.globalScale}x</span>
                            </div>
                            <input type="range" min="0.5" max="1.5" step="0.05" value={settings.globalScale} onChange={(e) => handleChange('globalScale', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Structure / Layout</label>
                            <div className="toggle-group full">
                                <button className={`toggle-btn ${settings.layoutMode === 'single' ? 'active' : ''}`} onClick={() => handleChange('layoutMode', 'single')}>Single</button>
                                <button className={`toggle-btn ${settings.layoutMode === 'double' ? 'active' : ''}`} onClick={() => handleChange('layoutMode', 'double')}>Double</button>
                                <button className={`toggle-btn ${settings.layoutMode === 'mix' ? 'active' : ''}`} onClick={() => handleChange('layoutMode', 'mix')}>Mixed</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Icon Aesthetic</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.iconStyle === 'border' ? 'active' : ''}`} onClick={() => handleChange('iconStyle', 'border')}>Border</button>
                                <button className={`toggle-btn ${settings.iconStyle === 'fill' ? 'active' : ''}`} onClick={() => handleChange('iconStyle', 'fill')}>Fill</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Page Background</label>
                            <input type="color" value={settings.pageBackground || '#ffffff'} onChange={(e) => handleChange('pageBackground', e.target.value)} />
                        </div>
                        <div className="design-group">
                            <label>Primary Text Color</label>
                            <input type="color" value={settings.textColor || '#334155'} onChange={(e) => handleChange('textColor', e.target.value)} />
                        </div>
                    </>
                );
            case 'profile':
                return (
                    <>
                        <FontSelector label="Profile Font" value={settings.profileFont} onSelect={(val) => handleChange('profileFont', val)} />
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Name Size</label>
                                <span>{settings.profileNameSize}rem</span>
                            </div>
                            <input type="range" min="1.0" max="5.0" step="0.1" value={settings.profileNameSize} onChange={(e) => handleChange('profileNameSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Title Size</label>
                                <span>{settings.profileTitleSize}rem</span>
                            </div>
                            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.profileTitleSize} onChange={(e) => handleChange('profileTitleSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Icon Size</label>
                                <span>{settings.contactIconSize}px</span>
                            </div>
                            <input type="range" min="8" max="24" value={settings.contactIconSize} onChange={(e) => handleChange('contactIconSize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Contact Spacing</label>
                                <span>{settings.contactSpacing}px</span>
                            </div>
                            <input type="range" min="0" max="30" value={settings.contactSpacing} onChange={(e) => handleChange('contactSpacing', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Profile Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.headerAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('headerAlignment', 'left')}>Left</button>
                                <button className={`toggle-btn ${settings.headerAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('headerAlignment', 'center')}>Center</button>
                                <button className={`toggle-btn ${settings.headerAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('headerAlignment', 'right')}>Right</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Icon Aesthetic</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.iconStyle === 'border' ? 'active' : ''}`} onClick={() => handleChange('iconStyle', 'border')}>Border Only</button>
                                <button className={`toggle-btn ${settings.iconStyle === 'fill' ? 'active' : ''}`} onClick={() => handleChange('iconStyle', 'fill')}>Solid Fill</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Professional Filters</label>
                            <div className="toggle-group full">
                                <button className={`toggle-btn ${settings.profileImageGrayscale ? 'active' : ''}`} onClick={() => handleChange('profileImageGrayscale', !settings.profileImageGrayscale)}>
                                    Black & White {settings.profileImageGrayscale ? 'ON' : 'OFF'}
                                </button>
                                <button className={`toggle-btn ${settings.iconsOnly ? 'active' : ''}`} onClick={() => handleChange('iconsOnly', !settings.iconsOnly)}>
                                    Minimal Icons {settings.iconsOnly ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Photo Brightness</label>
                                <span>{Math.round(settings.profileImageBrightness * 100)}%</span>
                            </div>
                            <input type="range" min="0.5" max="1.5" step="0.05" value={settings.profileImageBrightness} onChange={(e) => handleChange('profileImageBrightness', parseFloat(e.target.value))} />
                        </div>
                    </>
                );
            case 'summary':
                return (
                    <>
                        <FontSelector label="Summary Font" value={settings.summaryFont} onSelect={(val) => handleChange('summaryFont', val)} />
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Font Size</label>
                                <span>{settings.summaryFontSize}px</span>
                            </div>
                            <input type="range" min="10" max="24" value={settings.summaryFontSize} onChange={(e) => handleChange('summaryFontSize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Line Height</label>
                                <span>{settings.summaryLineHeight}</span>
                            </div>
                            <input type="range" min="1.0" max="2.5" step="0.1" value={settings.summaryLineHeight} onChange={(e) => handleChange('summaryLineHeight', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Section Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.summaryAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('summaryAlignment', 'left')}>L</button>
                                <button className={`toggle-btn ${settings.summaryAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('summaryAlignment', 'center')}>C</button>
                                <button className={`toggle-btn ${settings.summaryAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('summaryAlignment', 'right')}>R</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Custom Title color</label>
                            <input type="color" value={settings.summaryColor || '#000000'} onChange={(e) => handleChange('summaryColor', e.target.value)} />
                        </div>
                        <div className="design-group">
                            <label>Style</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.summaryFontStyle === 'normal' ? 'active' : ''}`} onClick={() => handleChange('summaryFontStyle', 'normal')}>Normal</button>
                                <button className={`toggle-btn ${settings.summaryFontStyle === 'italic' ? 'active' : ''}`} onClick={() => handleChange('summaryFontStyle', 'italic')}>Italic</button>
                            </div>
                        </div>
                    </>
                );
            case 'experience':
                return (
                    <>
                        <FontSelector label="Exp Title Font" value={settings.experienceTitleFont} onSelect={(val) => handleChange('experienceTitleFont', val)} />
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Exp Title Size</label>
                                <span>{settings.experienceTitleSize}rem</span>
                            </div>
                            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.experienceTitleSize} onChange={(e) => handleChange('experienceTitleSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Company Font Size</label>
                                <span>{settings.experienceCompanySize}px</span>
                            </div>
                            <input type="range" min="10" max="18" value={settings.experienceCompanySize} onChange={(e) => handleChange('experienceCompanySize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Description Size</label>
                                <span>{settings.experienceBodySize}px</span>
                            </div>
                            <input type="range" min="10" max="18" value={settings.experienceBodySize} onChange={(e) => handleChange('experienceBodySize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Item Spacing</label>
                                <span>{settings.experienceItemSpacing}px</span>
                            </div>
                            <input type="range" min="0" max="40" step="5" value={settings.experienceItemSpacing} onChange={(e) => handleChange('experienceItemSpacing', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.experienceAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('experienceAlignment', 'left')}>L</button>
                                <button className={`toggle-btn ${settings.experienceAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('experienceAlignment', 'center')}>C</button>
                                <button className={`toggle-btn ${settings.experienceAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('experienceAlignment', 'right')}>R</button>
                            </div>
                        </div>
                    </>
                );
            case 'education':
                return (
                    <>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Degree Size</label>
                                <span>{settings.educationTitleSize}rem</span>
                            </div>
                            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.educationTitleSize} onChange={(e) => handleChange('educationTitleSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Institution Size</label>
                                <span>{settings.educationInstitutionSize}px</span>
                            </div>
                            <input type="range" min="10" max="18" value={settings.educationInstitutionSize} onChange={(e) => handleChange('educationInstitutionSize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Item Spacing</label>
                                <span>{settings.educationItemSpacing}px</span>
                            </div>
                            <input type="range" min="0" max="40" step="5" value={settings.educationItemSpacing} onChange={(e) => handleChange('educationItemSpacing', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.educationAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('educationAlignment', 'left')}>L</button>
                                <button className={`toggle-btn ${settings.educationAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('educationAlignment', 'center')}>C</button>
                                <button className={`toggle-btn ${settings.educationAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('educationAlignment', 'right')}>R</button>
                            </div>
                        </div>
                    </>
                );
            case 'projects':
                return (
                    <>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Project Name Size</label>
                                <span>{settings.projectTitleSize}rem</span>
                            </div>
                            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.projectTitleSize} onChange={(e) => handleChange('projectTitleSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Description Size</label>
                                <span>{settings.projectDescSize}px</span>
                            </div>
                            <input type="range" min="10" max="18" value={settings.projectDescSize} onChange={(e) => handleChange('projectDescSize', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Item Spacing</label>
                                <span>{settings.projectItemSpacing}px</span>
                            </div>
                            <input type="range" min="0" max="40" step="5" value={settings.projectItemSpacing} onChange={(e) => handleChange('projectItemSpacing', parseInt(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <label>Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.projectAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('projectAlignment', 'left')}>L</button>
                                <button className={`toggle-btn ${settings.projectAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('projectAlignment', 'center')}>C</button>
                                <button className={`toggle-btn ${settings.projectAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('projectAlignment', 'right')}>R</button>
                            </div>
                        </div>
                    </>
                );
            case 'skills':
                return (
                    <>
                        <div className="design-group">
                            <label>Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.skillsAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('skillsAlignment', 'left')}>Left</button>
                                <button className={`toggle-btn ${settings.skillsAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('skillsAlignment', 'center')}>Center</button>
                                <button className={`toggle-btn ${settings.skillsAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('skillsAlignment', 'right')}>Right</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Color</label>
                            <input type="color" value={settings.skillsColor || '#000000'} onChange={(e) => handleChange('skillsColor', e.target.value)} />
                        </div>
                    </>
                );
            case 'languages':
                return (
                    <>
                        <div className="design-group">
                            <label>Alignment</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.languagesAlignment === 'left' ? 'active' : ''}`} onClick={() => handleChange('languagesAlignment', 'left')}>Left</button>
                                <button className={`toggle-btn ${settings.languagesAlignment === 'center' ? 'active' : ''}`} onClick={() => handleChange('languagesAlignment', 'center')}>Center</button>
                                <button className={`toggle-btn ${settings.languagesAlignment === 'right' ? 'active' : ''}`} onClick={() => handleChange('languagesAlignment', 'right')}>Right</button>
                            </div>
                        </div>
                        <div className="design-group">
                            <label>Color</label>
                            <input type="color" value={settings.languagesColor || '#000000'} onChange={(e) => handleChange('languagesColor', e.target.value)} />
                        </div>
                    </>
                );
            case 'headings':
                return (
                    <>
                        <FontSelector label="Section Heading Font" value={settings.sectionHeadingFont} onSelect={(val) => handleChange('sectionHeadingFont', val)} />
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Heading Size</label>
                                <span>{settings.sectionHeadingSize}rem</span>
                            </div>
                            <input type="range" min="0.8" max="2.0" step="0.1" value={settings.sectionHeadingSize} onChange={(e) => handleChange('sectionHeadingSize', parseFloat(e.target.value))} />
                        </div>
                        <div className="design-group">
                            <div className="design-label-row">
                                <label>Weight</label>
                                <span>{settings.sectionHeadingWeight}</span>
                            </div>
                            <input type="range" min="300" max="900" step="100" value={settings.sectionHeadingWeight} onChange={(e) => handleChange('sectionHeadingWeight', parseInt(e.target.value))} />
                        </div>
                    </>
                );
            case 'structure':
                return (
                    <>
                        <div className="design-group">
                            <label>Section Title Aesthetics</label>
                            <div className="toggle-group full vertical-list">
                                <button className={`toggle-btn ${settings.sectionTitleStyle === 'plain' ? 'active' : ''}`} onClick={() => handleChange('sectionTitleStyle', 'plain')}>Plain</button>
                                <button className={`toggle-btn ${settings.sectionTitleStyle === 'underline' ? 'active' : ''}`} onClick={() => handleChange('sectionTitleStyle', 'underline')}>Underline</button>
                                <button className={`toggle-btn ${settings.sectionTitleStyle === 'full-underline' ? 'active' : ''}`} onClick={() => handleChange('sectionTitleStyle', 'full-underline')}>Full Line</button>
                                <button className={`toggle-btn ${settings.sectionTitleStyle === 'background-shade' ? 'active' : ''}`} onClick={() => handleChange('sectionTitleStyle', 'background-shade')}>Shaded</button>
                                <button className={`toggle-btn ${settings.sectionTitleStyle === 'side-border' ? 'active' : ''}`} onClick={() => handleChange('sectionTitleStyle', 'side-border')}>Side Bar</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Bullet Point Style</label>
                            <div className="toggle-group full">
                                <button className={`toggle-btn ${settings.bulletPointStyle === 'dot' ? 'active' : ''}`} onClick={() => handleChange('bulletPointStyle', 'dot')}>Dot</button>
                                <button className={`toggle-btn ${settings.bulletPointStyle === 'square' ? 'active' : ''}`} onClick={() => handleChange('bulletPointStyle', 'square')}>Square</button>
                                <button className={`toggle-btn ${settings.bulletPointStyle === 'arrow' ? 'active' : ''}`} onClick={() => handleChange('bulletPointStyle', 'arrow')}>Arrow</button>
                                <button className={`toggle-btn ${settings.bulletPointStyle === 'checkmark' ? 'active' : ''}`} onClick={() => handleChange('bulletPointStyle', 'checkmark')}>Check</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Bullet Color Tint</label>
                            <input type="color" value={settings.bulletPointColor || '#6366f1'} onChange={(e) => handleChange('bulletPointColor', e.target.value)} />
                        </div>

                        <div className="design-group">
                            <label>Experience Layout</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.experienceStyle === 'classic' ? 'active' : ''}`} onClick={() => handleChange('experienceStyle', 'classic')}>Plain</button>
                                <button className={`toggle-btn ${settings.experienceStyle === 'timeline' ? 'active' : ''}`} onClick={() => handleChange('experienceStyle', 'timeline')}>Nodes</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Education Style</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.educationStyle === 'classic' ? 'active' : ''}`} onClick={() => handleChange('educationStyle', 'classic')}>Plain</button>
                                <button className={`toggle-btn ${settings.educationStyle === 'timeline' ? 'active' : ''}`} onClick={() => handleChange('educationStyle', 'timeline')}>Timeline</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Skills Visualization</label>
                            <div className="toggle-group vertical-list">
                                <button className={`toggle-btn ${settings.skillsStyle === 'badges' ? 'active' : ''}`} onClick={() => handleChange('skillsStyle', 'badges')}>Pill Badges</button>
                                <button className={`toggle-btn ${settings.skillsStyle === 'progress' ? 'active' : ''}`} onClick={() => handleChange('skillsStyle', 'progress')}>Progress Bars</button>
                                <button className={`toggle-btn ${settings.skillsStyle === 'dots' ? 'active' : ''}`} onClick={() => handleChange('skillsStyle', 'dots')}>Rating Dots</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Projects layout</label>
                            <div className="toggle-group">
                                <button className={`toggle-btn ${settings.projectLayout === 'list' ? 'active' : ''}`} onClick={() => handleChange('projectLayout', 'list')}>List</button>
                                <button className={`toggle-btn ${settings.projectLayout === 'grid' ? 'active' : ''}`} onClick={() => handleChange('projectLayout', 'grid')}>Grid</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Contact Organization</label>
                            <div className="toggle-group vertical-list">
                                <button className={`toggle-btn ${settings.contactLayout === 'list' ? 'active' : ''}`} onClick={() => handleChange('contactLayout', 'list')}>Vertical List</button>
                                <button className={`toggle-btn ${settings.contactLayout === 'grid' ? 'active' : ''}`} onClick={() => handleChange('contactLayout', 'grid')}>Multi-Column Grid</button>
                                <button className={`toggle-btn ${settings.contactLayout === 'line' ? 'active' : ''}`} onClick={() => handleChange('contactLayout', 'line')}>Single Line Row</button>
                            </div>
                        </div>

                        <div className="design-group">
                            <label>Document Decor</label>
                            <div className="toggle-group vertical-list">
                                <button className={`toggle-btn ${settings.documentDecoration === 'none' ? 'active' : ''}`} onClick={() => handleChange('documentDecoration', 'none')}>Clean (Minimal)</button>
                                <button className={`toggle-btn ${settings.documentDecoration === 'border' ? 'active' : ''}`} onClick={() => handleChange('documentDecoration', 'border')}>Premium Frame</button>
                                <button className={`toggle-btn ${settings.documentDecoration === 'top-bar' ? 'active' : ''}`} onClick={() => handleChange('documentDecoration', 'top-bar')}>Header Bar</button>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`design-settings-widget ${isOpen ? 'open' : ''}`}>
            <button className="design-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                <span className="design-icon">🎨</span>
                <span className="design-text">Expert Design</span>
            </button>

            {isOpen && (
                <div className="design-panel animate-in">
                    <div className="design-header">
                        <h4>🎨 Custom Stylist</h4>
                        <button className="close-design" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="design-tabs-container">
                        <div className="design-tabs">
                            <button className={activeTab === 'themes' ? 'active' : ''} onClick={() => setActiveTab('themes')}>Themes</button>
                            <button className={activeTab === 'structure' ? 'active' : ''} onClick={() => setActiveTab('structure')}>Structure</button>
                            <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>All</button>
                            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Profile</button>
                            <button className={activeTab === 'summary' ? 'active' : ''} onClick={() => setActiveTab('summary')}>Summary</button>
                            <button className={activeTab === 'experience' ? 'active' : ''} onClick={() => setActiveTab('experience')}>Exp</button>
                            <button className={activeTab === 'education' ? 'active' : ''} onClick={() => setActiveTab('education')}>Edu</button>
                            <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>Proj</button>
                            <button className={activeTab === 'skills' ? 'active' : ''} onClick={() => setActiveTab('skills')}>Skills</button>
                            <button className={activeTab === 'languages' ? 'active' : ''} onClick={() => setActiveTab('languages')}>Lang</button>
                            <button className={activeTab === 'headings' ? 'active' : ''} onClick={() => setActiveTab('headings')}>Titles</button>
                        </div>
                    </div>

                    <div className="design-content">
                        {renderTabContent()}
                    </div>

                    <div className="design-footer">
                        <button className="reset-design-btn" onClick={() => onUpdate({
                            fontFamily: "Inter", fontSize: 14, lineHeight: 1.5, letterSpacing: 0,
                            sectionSpacing: 18, pagePadding: 25, layoutMode: 'single',
                            profileFont: "Montserrat", profileNameSize: 2.8, profileTitleSize: 1.1, contactIconSize: 14, contactSpacing: 8, headerAlignment: 'left', iconStyle: 'border',
                            summaryFont: "Lora", summaryFontSize: 14, summaryLineHeight: 1.6, summaryFontStyle: "normal",
                            experienceTitleFont: "Montserrat", experienceTitleSize: 1.1, experienceCompanySize: 14, experienceBodySize: 13, experienceItemSpacing: 15,
                            educationTitleSize: 1.1, educationInstitutionSize: 14, educationItemSpacing: 12,
                            projectTitleSize: 1.1, projectDescSize: 13, projectItemSpacing: 15,
                            sectionHeadingFont: "Montserrat", sectionHeadingSize: 1.0, sectionHeadingWeight: 700,
                            sectionTitleStyle: "plain", bulletPointStyle: "dot", bulletPointColor: "",
                            experienceStyle: 'classic', educationStyle: 'classic', skillsStyle: 'badges', projectLayout: 'list', contactLayout: 'list', documentDecoration: 'none',
                            profileImageGrayscale: false, profileImageBrightness: 1.0, iconsOnly: false
                        })}>
                            Reset Designer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignSettings;
