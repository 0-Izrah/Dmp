import { useEffect, useRef } from 'react';

/**
 * Hook for managing focus trapping in modals and panels
 * @param {boolean} isOpen - Whether the modal/panel is open
 * @param {function} onClose - Function to call when escape is pressed
 * @returns {object} - Ref to apply to the container element
 */
export const useFocusTrap = (isOpen, onClose) => {
  const containerRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    lastActiveElementRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstElement.focus();

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
      
      // Restore focus to the previously focused element
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
};

/**
 * Hook for managing focus restoration
 * @param {boolean} isOpen - Whether the modal/panel is open
 */
export const useFocusRestore = (isOpen) => {
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element when opening
      lastActiveElementRef.current = document.activeElement;
    } else {
      // Restore focus when closing
      if (lastActiveElementRef.current) {
        lastActiveElementRef.current.focus();
        lastActiveElementRef.current = null;
      }
    }
  }, [isOpen]);
};

/**
 * Hook for announcing live updates to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const useLiveAnnouncer = () => {
  const announce = (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return announce;
};
