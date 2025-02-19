import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback } from 'react';

export default function Modal({ children, onClose }) {
  const [portalContainer, setPortalContainer] = useState(null);

  const initializePortalContainer = useCallback(() => {
    // Try to find existing modal container
    let container = document.getElementById('modal');
    
    // If no container exists, create one
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal';
      document.body.appendChild(container);
    }
    
    return container;
  }, []);

  useEffect(() => {
    // Initialize portal container
    const container = initializePortalContainer();
    setPortalContainer(container);

    // Cleanup function
    return () => {
      if (container && container.childNodes.length === 0) {
        try {
          document.body.removeChild(container);
        } catch (error) {
          console.warn('Could not remove modal container:', error);
        }
      }
    };
  }, [initializePortalContainer]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Don't render anything until we have a container
  if (!portalContainer) {
    return null;
  }

  // Create the portal
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    portalContainer
  );
}
