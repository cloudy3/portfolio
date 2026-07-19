/**
 * Accessibility utilities and helpers
 */

// Focus management utilities
export const trapFocus = (element: HTMLElement) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
};

// Screen reader announcements
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
) => {
  if (typeof window === "undefined") return;

  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "sr-only";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Keyboard navigation helpers
export const handleArrowKeyNavigation = (
  event: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onIndexChange: (newIndex: number) => void
) => {
  let newIndex = currentIndex;

  switch (event.key) {
    case "ArrowDown":
    case "ArrowRight":
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
      break;
    case "ArrowUp":
    case "ArrowLeft":
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
      break;
    case "Home":
      newIndex = 0;
      break;
    case "End":
      newIndex = items.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  onIndexChange(newIndex);
  items[newIndex]?.focus();
};

// Color contrast checker
export const checkColorContrast = (
  foreground: string,
  background: string
): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  // Calculate relative luminance
  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLuminance = getLuminance(fg.r, fg.g, fg.b);
  const bgLuminance = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

// Reduced motion detection
export const prefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-contrast: high)").matches;
};

// ARIA live region manager
export class LiveRegionManager {
  private politeRegion: HTMLElement | null = null;
  private assertiveRegion: HTMLElement | null = null;

  constructor() {
    this.createRegions();
  }

  private createRegions() {
    if (typeof window === "undefined") return;

    // Polite region
    this.politeRegion = document.createElement("div");
    this.politeRegion.setAttribute("aria-live", "polite");
    this.politeRegion.setAttribute("aria-atomic", "true");
    this.politeRegion.className = "sr-only";
    document.body.appendChild(this.politeRegion);

    // Assertive region
    this.assertiveRegion = document.createElement("div");
    this.assertiveRegion.setAttribute("aria-live", "assertive");
    this.assertiveRegion.setAttribute("aria-atomic", "true");
    this.assertiveRegion.className = "sr-only";
    document.body.appendChild(this.assertiveRegion);
  }

  announce(message: string, priority: "polite" | "assertive" = "polite") {
    const region =
      priority === "assertive" ? this.assertiveRegion : this.politeRegion;

    if (region) {
      region.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        region.textContent = "";
      }, 1000);
    }
  }

  destroy() {
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
    }
    if (this.assertiveRegion) {
      document.body.removeChild(this.assertiveRegion);
    }
  }
}

// Form accessibility helpers
export const enhanceFormAccessibility = (form: HTMLFormElement) => {
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    const label = form.querySelector(`label[for="${input.id}"]`);

    if (
      !label &&
      !input.getAttribute("aria-label") &&
      !input.getAttribute("aria-labelledby")
    ) {
      console.warn("Input missing accessible label:", input);
    }

    // Add required indicator to screen readers
    if (input.hasAttribute("required")) {
      const existingLabel =
        label?.textContent || input.getAttribute("aria-label") || "";
      if (!existingLabel.includes("required")) {
        if (label) {
          label.textContent = `${existingLabel} (required)`;
        } else {
          input.setAttribute("aria-label", `${existingLabel} (required)`);
        }
      }
    }
  });
};

// Accessible modal helpers
export const makeModalAccessible = (
  modal: HTMLElement,
  trigger?: HTMLElement
) => {
  // Set ARIA attributes
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  // Find or create a title
  const title = modal.querySelector("h1, h2, h3, h4, h5, h6");
  if (title && !title.id) {
    title.id = `modal-title-${Date.now()}`;
    modal.setAttribute("aria-labelledby", title.id);
  }

  // Trap focus
  const cleanup = trapFocus(modal);

  // Handle escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      // Close modal logic would go here
      trigger?.focus();
    }
  };

  modal.addEventListener("keydown", handleEscape);

  // Return cleanup function
  return () => {
    cleanup();
    modal.removeEventListener("keydown", handleEscape);
  };
};
