import React, { useState, useRef, useEffect } from 'react';
import './CustomDropdown.css';

const CustomDropdown = ({ options, value, onChange, placeholder = "Select option", className = "", style = {} }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const selectedOption = options.find(opt => opt.value === value) || null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div className={`premium-dropdown ${isOpen ? 'is-open' : ''} ${className}`} ref={containerRef} style={style}>
            <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
                <span className="selected-label">{selectedOption ? selectedOption.label : placeholder}</span>
                <span className="dropdown-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2 2 6 6 10 2" />
                    </svg>
                </span>
            </div>

            <div className="dropdown-menu">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`dropdown-item ${value === option.value ? 'active' : ''}`}
                        onClick={() => handleSelect(option.value)}
                    >
                        <span className="item-label">{option.label}</span>
                        {value === option.value && <span className="item-check">✓</span>}
                    </div>
                ))}
                {options.length === 0 && (
                    <div className="dropdown-no-options">No items found</div>
                )}
            </div>
        </div>
    );
};

export default CustomDropdown;
