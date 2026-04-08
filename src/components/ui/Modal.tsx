import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { cn } from "@/lib/utils";
import { Z_INDEX } from "@/lib/constants";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  size = "md",
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLBodyElement | null>(null);

  useEffect(() => {
    bodyRef.current = document.body as HTMLBodyElement;
  }, []);

  useEffect(() => {
    if (isOpen && bodyRef.current) {
      // Store original styles
      const originalOverflow = bodyRef.current.style.overflow;
      const originalPosition = bodyRef.current.style.position;
      const originalTop = bodyRef.current.style.top;
      const originalWidth = bodyRef.current.style.width;
      const originalHeight = bodyRef.current.style.height;

      // Get current scroll position
      const scrollY = window.scrollY;

      // Lock the body
      bodyRef.current.style.overflow = "hidden";
      bodyRef.current.style.position = "fixed";
      bodyRef.current.style.top = `-${scrollY}px`;
      bodyRef.current.style.width = "100%";
      bodyRef.current.style.height = "100%";

      return () => {
        // Restore original styles
        bodyRef.current!.style.overflow = originalOverflow;
        bodyRef.current!.style.position = originalPosition;
        bodyRef.current!.style.top = originalTop;
        bodyRef.current!.style.width = originalWidth;
        bodyRef.current!.style.height = originalHeight;

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return ReactDOM.createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-surface-inverse/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden"
      style={{ zIndex: Z_INDEX.modal }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "bg-surface-elevated border border-border-subtle rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto",
          sizes[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

interface ModalHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  onClose,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 border-b border-border-subtle",
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-content-muted hover:text-content-primary transition-colors rounded-md p-1"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
}) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 border-t border-border-subtle",
        className
      )}
    >
      {children}
    </div>
  );
};
