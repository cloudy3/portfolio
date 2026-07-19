import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ContactSection from "../sections/ContactSection";

vi.mock("@emailjs/browser", () => ({
  send: vi.fn(() => Promise.resolve({ status: 200 })),
}));

vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: { div: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div> },
    useReducedMotion: () => true,
  };
});

describe("ContactSection", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "s";
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "t";
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "k";
  });

  it("renders form and social links", () => {
    render(<ContactSection />);
    expect(
      screen.getByRole("heading", { name: /Let’s build something solid/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub profile/i })).toBeInTheDocument();
  });

  it("validates empty submit", async () => {
    render(<ContactSection />);
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });
});
