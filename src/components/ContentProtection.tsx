import { useEffect } from 'react';

interface ContentProtectionProps {
  children: React.ReactNode;
}

export default function ContentProtection({ children }: ContentProtectionProps) {
  useEffect(() => {
    // Prevent right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Prevent drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts for saving
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, Ctrl+C, Ctrl+U, F12
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'c' || e.key === 'u')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    // Prevent print
    const handleBeforePrint = () => {
      window.print = () => {};
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    handleBeforePrint();

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="content-protected" style={{ position: 'relative' }}>
      {children}
    </div>
  );
}
