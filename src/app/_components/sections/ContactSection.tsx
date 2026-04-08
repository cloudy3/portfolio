"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ContactForm } from "@/types";
import { VALIDATION, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { SectionHeader } from "../ui/SectionHeader";
import { FadeIn } from "../motion/FadeIn";

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: FormErrors;
}

const inputClass = (hasError: boolean) =>
  `w-full px-4 py-3 border rounded-md bg-surface-elevated text-content-primary placeholder:text-content-muted transition-shadow text-sm ${
    hasError
      ? "border-red-500/80 ring-1 ring-red-500/30"
      : "border-border-strong hover:border-accent-cyan/25 focus:ring-2 focus:ring-accent-cyan/40 focus:border-accent-cyan/40"
  }`;

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    errors: {},
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setIsVisible(true);
        });
      },
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  const validateField = (name: keyof ContactForm, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.trim().length < VALIDATION.minNameLength)
          return `Name must be at least ${VALIDATION.minNameLength} characters`;
        if (value.trim().length > VALIDATION.maxNameLength)
          return `Name must be less than ${VALIDATION.maxNameLength} characters`;
        return "";
      case "email":
        if (!value.trim()) return "Email is required";
        if (!VALIDATION.email.test(value))
          return "Please enter a valid email address";
        return "";
      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.trim().length < 3)
          return "Subject must be at least 3 characters";
        return "";
      case "message":
        if (!value.trim()) return "Message is required";
        if (value.trim().length < VALIDATION.minMessageLength)
          return `Message must be at least ${VALIDATION.minMessageLength} characters`;
        if (value.trim().length > VALIDATION.maxMessageLength)
          return `Message must be less than ${VALIDATION.maxMessageLength} characters`;
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ContactForm;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    const error = validateField(fieldName, value);
    setFormState((prev) => ({
      ...prev,
      errors: { ...prev.errors, [fieldName]: error },
    }));
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof ContactForm, value);
      if (error) {
        errors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setFormState((prev) => ({ ...prev, errors }));
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS is not properly configured. Please check your environment variables."
        );
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "cjingfeng98@gmail.com",
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));

      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => {
        setFormState((prev) => ({ ...prev, isSubmitted: false }));
      }, 5000);
    } catch (error) {
      let errorMessage = "Failed to send message. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("network")) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
        } else if (error.message.includes("template")) {
          errorMessage =
            "Email service configuration error. Please try again later.";
        } else if (error.message.includes("rate")) {
          errorMessage =
            "Too many requests. Please wait a moment and try again.";
        }
      }

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        errors: { ...prev.errors, message: errorMessage },
      }));
    }
  };

  const socialLabel = (icon: string) => {
    if (icon === "github") return "GitHub";
    if (icon === "linkedin") return "LinkedIn";
    if (icon === "email") return "Email";
    return "Link";
  };

  return (
    <Section id="contact" variant="subtle" className="scroll-mt-20">
      <div ref={sectionRef}>
      <Container>
        <FadeIn>
          <SectionHeader
            align="center"
            eyebrow="Contact"
            title="Let’s build something solid"
            description="Open to roles and collaborations that value clear communication, pragmatic architecture, and calm execution."
          />
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto">
          <div
            className={`space-y-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
            }`}
          >
            <div>
              <h3 className="text-lg font-semibold text-content-primary mb-3">
                Direct lines
              </h3>
              <p className="text-content-secondary leading-relaxed text-sm md:text-base">
                Prefer email for anything substantive—I read everything and
                reply within about a day.
              </p>
            </div>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <span className="font-mono text-xs text-accent-cyan w-10 pt-1">
                  01
                </span>
                <div>
                  <p className="font-mono-label mb-1">Email</p>
                  <a
                    href="mailto:cjingfeng98@gmail.com"
                    className="text-content-primary hover:text-accent-cyan transition-colors"
                  >
                    cjingfeng98@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-xs text-accent-cyan w-10 pt-1">
                  02
                </span>
                <div>
                  <p className="font-mono-label mb-1">Location</p>
                  <p className="text-content-secondary text-sm">
                    Remote-friendly · APAC-friendly hours
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="font-mono text-xs text-accent-cyan w-10 pt-1">
                  03
                </span>
                <div>
                  <p className="font-mono-label mb-1">Response</p>
                  <p className="text-content-secondary text-sm">
                    Typically within 24 hours
                  </p>
                </div>
              </li>
            </ul>

            <div>
              <p className="font-mono-label mb-3">Elsewhere</p>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 rounded-md border border-border-subtle bg-surface-elevated text-sm font-medium text-content-secondary hover:border-accent-cyan/35 hover:text-content-primary transition-colors"
                    aria-label={`${socialLabel(social.icon)} profile`}
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-150 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
            }`}
          >
            <div className="rounded-lg border border-border-subtle bg-surface-elevated p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-semibold text-content-primary mb-6">
                Message
              </h3>

              {formState.isSubmitted && (
                <div
                  className="mb-6 p-4 rounded-md border border-emerald-500/25 bg-emerald-500/5 text-sm text-content-secondary"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="font-medium text-content-primary">
                    Sent. Thank you—I’ll reply soon.
                  </p>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-mono-label mb-2 text-content-muted"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={inputClass(!!formState.errors.name)}
                    placeholder="Your name"
                    aria-invalid={!!formState.errors.name}
                    aria-describedby={
                      formState.errors.name ? "name-error" : undefined
                    }
                  />
                  {formState.errors.name && (
                    <p id="name-error" className="mt-2 text-sm text-red-600">
                      {formState.errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-mono-label mb-2 text-content-muted"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClass(!!formState.errors.email)}
                    placeholder="you@example.com"
                    aria-invalid={!!formState.errors.email}
                    aria-describedby={
                      formState.errors.email ? "email-error" : undefined
                    }
                  />
                  {formState.errors.email && (
                    <p id="email-error" className="mt-2 text-sm text-red-600">
                      {formState.errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block font-mono-label mb-2 text-content-muted"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={inputClass(!!formState.errors.subject)}
                    placeholder="Topic"
                    aria-invalid={!!formState.errors.subject}
                    aria-describedby={
                      formState.errors.subject ? "subject-error" : undefined
                    }
                  />
                  {formState.errors.subject && (
                    <p id="subject-error" className="mt-2 text-sm text-red-600">
                      {formState.errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono-label mb-2 text-content-muted"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className={`${inputClass(!!formState.errors.message)} resize-y min-h-[120px]`}
                    placeholder="What are we solving?"
                    aria-invalid={!!formState.errors.message}
                    aria-describedby={
                      formState.errors.message ? "message-error" : undefined
                    }
                  />
                  <div className="flex justify-between mt-2 text-xs text-content-muted">
                    {formState.errors.message ? (
                      <p id="message-error" className="text-red-600">
                        {formState.errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span>
                      {formData.message.length}/{VALIDATION.maxMessageLength}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className={`w-full py-3 px-5 rounded-md text-sm font-semibold transition-opacity ${
                    formState.isSubmitting
                      ? "bg-content-muted text-content-inverse cursor-not-allowed"
                      : "bg-surface-inverse text-content-inverse hover:opacity-90"
                  }`}
                >
                  {formState.isSubmitting ? "Sending…" : "Send message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
      </div>
    </Section>
  );
}
