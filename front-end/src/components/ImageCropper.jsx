import React, { useState, useRef, useEffect } from 'react';
import './ImageCropper.css';

const ImageCropper = ({ image, onCrop, onCancel }) => {
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imgRef = useRef(null);
    const containerRef = useRef(null);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const getCroppedImg = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 400; // Final output size
        canvas.width = size;
        canvas.height = size;

        if (!imgRef.current) return;

        const img = imgRef.current;

        // We want to capture what's in the middle 300x300 of the container
        // The image is scaled by 'zoom' and moved by 'offset'

        // Simplification for this custom tool:
        // We'll calculate the source coordinates based on the current visual state
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        // For now, let's use a simpler approach: 
        // Draw the image onto the canvas exactly as it appears in the crop box
        ctx.clearRect(0, 0, size, size);
        ctx.save();

        // Center of canvas
        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        // Calculate scaling to map container units to canvas units
        // Crop box is 300px in a container that might be different
        const cropBoxSize = 300;
        const scale = size / cropBoxSize;

        const drawX = offset.x * scale;
        const drawY = offset.y * scale;
        const drawWidth = img.naturalWidth * (img.width / img.naturalWidth) * zoom * scale;
        const drawHeight = img.naturalHeight * (img.height / img.naturalHeight) * zoom * scale;

        ctx.drawImage(
            img,
            -(drawWidth / 2) + drawX,
            -(drawHeight / 2) + drawY,
            drawWidth,
            drawHeight
        );

        ctx.restore();

        onCrop(canvas.toDataURL('image/jpeg', 0.9));
    };

    return (
        <div className="cropper-modal-overlay">
            <div className="cropper-card animate-in">
                <div className="cropper-header">
                    <h3>Adjust Photo</h3>
                    <p>Drag to reposition, use slider to zoom</p>
                </div>

                <div
                    className="cropper-container"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="crop-box"></div>
                    <img
                        ref={imgRef}
                        src={image}
                        alt="To crop"
                        draggable="false"
                        style={{
                            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    />
                </div>

                <div className="cropper-controls">
                    <div className="zoom-slider">
                        <span>➖</span>
                        <input
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.01"
                            value={zoom}
                            onChange={handleZoomChange}
                        />
                        <span>➕</span>
                    </div>

                    <div className="action-row">
                        <button className="rotate-btn" onClick={handleRotate}>
                            🔄 Rotate
                        </button>
                        <div className="main-actions">
                            <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                            <button className="btn-save" onClick={getCroppedImg}>Save Photo</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
