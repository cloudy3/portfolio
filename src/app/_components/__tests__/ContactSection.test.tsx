import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, type Mock } from "vitest";
import emailjs from "@emailjs/browser";
import ContactSection from "../sections/ContactSection";

vi.mock("@emailjs/browser", () => ({
  default: { send: vi.fn(() => Promise.resolve({ status: 200 })) },
  send: vi.fn(() => Promise.resolve({ status: 200 })),
}));

const mockSend = emailjs.send as Mock;

/** Fill every required field with values that pass validation. */
const fillValidForm = () => {
  fireEvent.change(screen.getByLabelText("Name *"), {
    target: { name: "name", value: "Ada Lovelace" },
  });
  fireEvent.change(screen.getByLabelText("Email *"), {
    target: { name: "email", value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Subject *"), {
    target: { name: "subject", value: "Collaboration" },
  });
  fireEvent.change(screen.getByLabelText("Message *"), {
    target: { name: "message", value: "I would like to discuss a project." },
  });
};

vi.mock("framer-motion", () => {
  const React = require("react");
  return {
    motion: { div: ({ children, ...p }: { children?: React.ReactNode }) => <div {...p}>{children}</div> },
    useReducedMotion: () => true,
  };
});

describe("ContactSection", () => {
  beforeEach(() => {
    mockSend.mockReset();
    mockSend.mockResolvedValue({ status: 200 });
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID = "s";
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID = "t";
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "k";
  });

  it("renders form and social links", () => {
    render(<ContactSection />);
    expect(
      screen.getByRole("heading", { name: /Let’s build something solid/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /GitHub profile/i })).toBeInTheDocument();
  });

  it("validates empty submit", async () => {
    render(<ContactSection />);
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
    });
  });

  describe("submit failure", () => {
    it("shows a dedicated alert and does not blame the message field", async () => {
      mockSend.mockRejectedValue(new Error("network unreachable"));
      render(<ContactSection />);

      fillValidForm();
      fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/Message not sent/i);
      expect(alert).toHaveTextContent(/Network error/i);

      // The regression this covers: the transport error used to be written
      // into errors.message, so it rendered as message-field validation.
      const message = screen.getByLabelText("Message *");
      expect(message).not.toHaveAttribute("aria-invalid", "true");
      expect(
        screen.queryByText(/Message must be at least/i)
      ).not.toBeInTheDocument();
    });

    it("keeps the entered values so the user can retry", async () => {
      mockSend.mockRejectedValue(new Error("boom"));
      render(<ContactSection />);

      fillValidForm();
      fireEvent.click(screen.getByRole("button", { name: /Send message/i }));
      await screen.findByRole("alert");

      expect(screen.getByLabelText("Name *")).toHaveValue("Ada Lovelace");
      expect(screen.getByLabelText("Email *")).toHaveValue("ada@example.com");
      expect(screen.getByLabelText("Message *")).toHaveValue(
        "I would like to discuss a project."
      );
    });

    it("reports a configuration error when EmailJS env vars are missing", async () => {
      delete process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      render(<ContactSection />);

      fillValidForm();
      fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

      const alert = await screen.findByRole("alert");
      expect(alert).toHaveTextContent(/Message not sent/i);
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  it("clears the form and confirms on success", async () => {
    render(<ContactSection />);

    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: /Send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sent\. Thank you/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Name *")).toHaveValue("");
    expect(screen.getByLabelText("Message *")).toHaveValue("");
  });
});
