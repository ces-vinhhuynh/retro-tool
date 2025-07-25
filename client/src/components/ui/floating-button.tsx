'use client';

import { CircleChevronUp, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface FloatingButtonProps {
  name: string;
  title: string;
  onClick: () => void;
  onClose?: () => void;
  IconComponent?: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
}

const DRAG_THRESHOLD = 5;
const CLICK_DELAY_AFTER_DRAG = 100;

export function FloatingButton({
  name,
  title,
  onClick,
  onClose,
  IconComponent,
}: FloatingButtonProps) {
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasJustDragged, setHasJustDragged] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Real-time position for smooth dragging - button close will follow this
  const currentPositionRef = useRef({ x: 20, y: 100 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startPos: { x: 0, y: 0 },
    startMouse: { x: 0, y: 0 },
    animationId: null as number | null,
  });

  const Icon = IconComponent || CircleChevronUp;

  // Better viewport size calculation for mobile
  const getViewportSize = useCallback(() => {
    const height =
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement.clientHeight;
    const width =
      window.visualViewport?.width ||
      window.innerWidth ||
      document.documentElement.clientWidth;

    return {
      width: width,
      height: height,
    };
  }, []);

  // Calculate default position (center horizontally, 40px from bottom)
  const getDefaultPosition = useCallback(() => {
    const viewport = getViewportSize();
    const buttonSize = 56; // 14 * 4 = 56px (h-14 w-14)

    return {
      x: (viewport.width - buttonSize) / 2,
      y: viewport.height - buttonSize - 40,
    };
  }, [getViewportSize]);

  // Bound position within viewport with safe margins for mobile
  const getBoundedPosition = useCallback(
    (x: number, y: number) => {
      const viewport = getViewportSize();
      const buttonSize = 56; // 14 * 4 = 56px (h-14 w-14)
      const safeMargin = 10; // Extra margin for safe areas

      const maxX = viewport.width - buttonSize - safeMargin;
      const maxY = viewport.height - buttonSize - safeMargin;

      return {
        x: Math.max(safeMargin, Math.min(x, maxX)),
        y: Math.max(safeMargin, Math.min(y, maxY)),
      };
    },
    [getViewportSize],
  );

  // Load saved position on mount and ensure it's visible
  useEffect(() => {
    try {
      const savedPosition = localStorage.getItem(name);
      if (savedPosition) {
        const parsed = JSON.parse(savedPosition);
        // Ensure loaded position is still within bounds
        const boundedPos = getBoundedPosition(parsed.x, parsed.y);
        setPosition(boundedPos);
        currentPositionRef.current = boundedPos;
      } else {
        // Use calculated default position (center horizontally, 40px from bottom)
        const defaultPos = getDefaultPosition();
        const boundedPos = getBoundedPosition(defaultPos.x, defaultPos.y);
        setPosition(boundedPos);
        currentPositionRef.current = boundedPos;
      }
    } catch (error) {
      console.error('Failed to load button position:', error);
      // Fallback to bounded default position
      const defaultPos = getDefaultPosition();
      const boundedPos = getBoundedPosition(defaultPos.x, defaultPos.y);
      setPosition(boundedPos);
      currentPositionRef.current = boundedPos;
    }
  }, [name, getBoundedPosition, getDefaultPosition]);

  // Handle viewport changes (like orientation change)
  useEffect(() => {
    const handleResize = () => {
      // Only reset to default position if no saved position exists
      const savedPosition = localStorage.getItem(name);
      if (!savedPosition) {
        const defaultPos = getDefaultPosition();
        const boundedPos = getBoundedPosition(defaultPos.x, defaultPos.y);
        setPosition(boundedPos);
        currentPositionRef.current = boundedPos;
      } else {
        // Ensure current position is still within bounds after resize
        setPosition((prev) => {
          const newPos = getBoundedPosition(prev.x, prev.y);
          currentPositionRef.current = newPos;
          return newPos;
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [name, getDefaultPosition, getBoundedPosition]);

  // Save position to localStorage
  const savePosition = useCallback(
    (newPosition: { x: number; y: number }) => {
      try {
        localStorage.setItem(name, JSON.stringify(newPosition));
      } catch (error) {
        console.error('Failed to save button position:', error);
      }
    },
    [name],
  );

  // Animation loop for smooth dragging
  const animateDrag = useCallback(() => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging || !buttonRef.current) return;

    dragState.animationId = requestAnimationFrame(animateDrag);
  }, []);

  // Start drag
  const startDrag = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!buttonRef.current) return;

      const dragState = dragStateRef.current;

      // Record starting positions
      dragState.startPos = { x: position.x, y: position.y };
      dragState.startMouse = { x: mouseX, y: mouseY };
      dragState.isDragging = true;

      setIsDragging(true);

      // Start animation loop
      dragState.animationId = requestAnimationFrame(animateDrag);

      // Prevent text selection
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    },
    [position.x, position.y, animateDrag],
  );

  // Update position during drag
  const updateDragPosition = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!dragStateRef.current.isDragging || !buttonRef.current) return;

      const dragState = dragStateRef.current;

      // Calculate new position based on mouse delta
      const deltaX = mouseX - dragState.startMouse.x;
      const deltaY = mouseY - dragState.startMouse.y;

      const newX = dragState.startPos.x + deltaX;
      const newY = dragState.startPos.y + deltaY;

      const boundedPos = getBoundedPosition(newX, newY);

      // Update both position state and current position ref for real-time updates
      currentPositionRef.current = boundedPos;
      setPosition(boundedPos);
    },
    [getBoundedPosition],
  );

  // End drag
  const endDrag = useCallback(() => {
    const dragState = dragStateRef.current;
    if (!dragState.isDragging) return;

    dragState.isDragging = false;
    setIsDragging(false);

    // Cancel animation loop
    if (dragState.animationId) {
      cancelAnimationFrame(dragState.animationId);
      dragState.animationId = null;
    }

    // Check if user actually dragged
    const deltaX = Math.abs(position.x - dragState.startPos.x);
    const deltaY = Math.abs(position.y - dragState.startPos.y);
    const actuallyDragged = deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD;

    if (actuallyDragged) {
      setHasJustDragged(true);
      savePosition(position);

      // Reset the flag after a short delay
      setTimeout(() => {
        setHasJustDragged(false);
      }, CLICK_DELAY_AFTER_DRAG);
    }

    // Re-enable text selection
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  }, [position, savePosition]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag],
  );

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag],
  );

  // Set up global event listeners
  useEffect(() => {
    // Copy ref value to local variable to avoid stale closure warning
    const dragState = dragStateRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      updateDragPosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragStateRef.current.isDragging) {
        e.preventDefault(); // Prevent scrolling
        const touch = e.touches[0];
        updateDragPosition(touch.clientX, touch.clientY);
      }
    };

    const handleMouseUp = () => {
      endDrag();
    };

    const handleTouchEnd = () => {
      endDrag();
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      // Cleanup
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);

      // Cancel any pending animation using the local variable
      if (dragState.animationId) {
        cancelAnimationFrame(dragState.animationId);
      }
    };
  }, [updateDragPosition, endDrag]);

  // Handle click
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging || hasJustDragged) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      onClick();
    },
    [isDragging, hasJustDragged, onClick],
  );

  // Handle close button click
  const handleClose = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsVisible(false);

      // Clear saved position data
      try {
        localStorage.removeItem(name);
      } catch (error) {
        console.error('Failed to clear button position data:', error);
      }

      onClose?.();
    },
    [name, onClose],
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Main floating button */}
      <Button
        ref={buttonRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className={cn(
          // Fixed positioning
          'fixed z-50 h-14 w-14 rounded-full shadow-lg',
          // Colors and styling
          'border-2 border-white/20 bg-blue-600 text-white hover:bg-blue-700',
          // Drag states
          isDragging
            ? 'scale-110 cursor-grabbing shadow-2xl'
            : 'cursor-grab hover:scale-105 hover:cursor-pointer',
          // Smooth transitions when not dragging
          !isDragging && 'transition-all duration-200',
          // Focus states
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none',
          // Disable pointer events briefly after drag
          hasJustDragged && 'pointer-events-none',
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
          // Ensure button is above mobile UI elements
          zIndex: 19,
        }}
        title={title}
      >
        <div className="flex items-center justify-center">
          <Icon className="!h-6 !w-6" />
        </div>
      </Button>

      {/* Close button (X) - positioned to the right of main button */}
      {onClose && (
        <Button
          onClick={handleClose}
          className={cn(
            // Fixed positioning
            'fixed z-50 h-6 w-6 rounded-full shadow-md',
            // Colors and styling - smaller and more subtle gray
            'border border-white/30 bg-gray-500 text-white hover:bg-gray-600',
            // Smooth transitions - disable during drag for smoother movement
            !isDragging && 'transition-all duration-200 hover:scale-105',
            // Focus states
            'focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none',
            // Ensure proper centering
            'flex items-center justify-center p-0',
          )}
          style={{
            left: `${position.x + 48}px`, // Follow main button position
            top: `${position.y - 2}px`, // Follow main button position
            touchAction: 'none',
            zIndex: 20, // Above main button
          }}
          title="Close"
        >
          <X className="!h-3 !w-3" />
        </Button>
      )}
    </>
  );
}
