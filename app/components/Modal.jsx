'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
    useEffect(() => {
        // Prevent scrolling when modal is open
        document.body.style.overflow = 'hidden';

        // Add ESC key listener
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);

        // Cleanup
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Check if window is available (client-side)
    if (typeof window === 'undefined') return null;

    const modalRoot = document.getElementById('modal');
    if (!modalRoot) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#333'
                    }}
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        modalRoot
    );
} 