"use client";

import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ContactForm } from "@/types";
import { VALIDATION, SOCIAL_LINKS, CONTACT_EMAIL } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
  /** Submission/transport failure — distinct from per-field validation. */
  submitError: string | null;
}

/**
 * Field styling.
 *
 * The error state used to be red-600 / red-500 and the success banner
 * emerald-500: a second and third accent on a site locked to one. Errors now use
 * the locked accent, which works out here because shu-iro IS a red, so it reads
 * as an error without importing a new hue. Verified at 5.4:1 in light and 4.8:1
 * in dark against the elevated surface.
 *
 * Success deliberately does NOT take the accent. It gets a neutral ink
 * treatment: green would have been a fourth hue, and "Sent. Thank you" does not
 * need colour to be understood. Colour is not the sole indicator in either state.
 */
const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-control border bg-surface-elevated px-4 py-3 text-sm text-content-primary placeholder:text-content-muted transition-colors",
    hasError
      ? "border-accent"
      : "border-border-strong hover:border-content-muted focus:border-accent"
  );

const labelClass = "mb-2 block text-xs font-medium text-content-secondary";

/**
 * Direct lines.
 *
 * These were numbered "01 / 02 / 03" under mono uppercase labels. Email,
 * location and response time are not a sequence, so the numbering applied
 * ordering to facts that have none.
 */
const DIRECT_LINES = [
  { label: "Location", value: "Remote and APAC-friendly hours" },
  { label: "Response", value: "Typically within 24 hours" },
];

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
    submitError: null,
  });

  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    },
    []
  );

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

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      submitError: null,
    }));

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
        to_email: CONTACT_EMAIL,
        reply_to: formData.email,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
      }));

      setFormData({ name: "", email: "", subject: "", message: "" });

      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
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
        submitError: errorMessage,
      }));
    }
  };

  const socialLabel = (icon: string) => {
    if (icon === "github") return "GitHub";
    if (icon === "linkedin") return "LinkedIn";
    if (icon === "email") return "Email";
    return "Link";
  };

  const fieldError = (id: keyof FormErrors, message?: string) =>
    message ? (
      <p id={`${id}-error`} className="mt-2 text-xs text-accent-ink">
        {message}
      </p>
    ) : null;

  return (
    <Section
      id="contact"
      variant="subtle"
      className="scroll-mt-20"
      field="planes"
      pigment="shu"
    >
      <Container keepOut>
        <FadeIn>
          <SectionHeader
            title="Let’s build something solid"
            description="Open to roles and collaborations that value clear communication, pragmatic architecture, and calm execution."
          />
        </FadeIn>

        {/*
         * The one two-column split on the page, which is why it is allowed here.
         * Contact details on lanes 1-3, form on 5-8, lane 4 left empty.
         */}
        <div className="lane-grid">
          <FadeIn className="md:col-span-3 md:pr-[var(--lane-inset)]">
            <p className="max-w-[36ch] text-content-secondary">
              Prefer email for anything substantive. I read everything and reply
              within about a day.
            </p>

            <dl className="mt-[calc(var(--rhythm)*10)] space-y-[calc(var(--rhythm)*6)]">
              <div>
                <dt className="text-xs text-content-muted">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-sm text-accent-ink underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </dd>
              </div>
              {DIRECT_LINES.map((line) => (
                <div key={line.label}>
                  <dt className="text-xs text-content-muted">{line.label}</dt>
                  <dd className="mt-1 text-sm text-content-secondary">
                    {line.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-[calc(var(--rhythm)*10)] flex flex-wrap gap-2 border-t border-border-subtle pt-[calc(var(--rhythm)*6)]">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-control border border-border-subtle px-3 py-2 text-xs font-medium text-content-secondary transition-colors hover:border-accent hover:text-content-primary active:translate-y-px"
                  aria-label={`${socialLabel(social.icon)} profile`}
                >
                  {social.name}
                </a>
              ))}
            </div>
          </FadeIn>

          <FadeIn beat={1} className="md:col-span-4 md:col-start-5">
            {formState.isSubmitted && (
              <div
                className="mb-[calc(var(--rhythm)*6)] border border-border-strong bg-surface-elevated p-4 text-sm text-content-secondary"
                role="alert"
                aria-live="polite"
              >
                <p className="font-medium text-content-primary">
                  Sent. Thank you, I’ll reply soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className={labelClass}>
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
                {fieldError("name", formState.errors.name)}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
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
                {fieldError("email", formState.errors.email)}
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>
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
                {fieldError("subject", formState.errors.subject)}
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={cn(
                    inputClass(!!formState.errors.message),
                    "min-h-[120px] resize-y"
                  )}
                  placeholder="What are we solving?"
                  aria-invalid={!!formState.errors.message}
                  aria-describedby={
                    formState.errors.message ? "message-error" : undefined
                  }
                />
                <div className="mt-2 flex justify-between gap-4 text-xs text-content-muted">
                  {formState.errors.message ? (
                    <p id="message-error" className="text-accent-ink">
                      {formState.errors.message}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="num shrink-0">
                    {formData.message.length}/{VALIDATION.maxMessageLength}
                  </span>
                </div>
              </div>

              {formState.submitError && (
                <div
                  className="border-l-2 border-accent bg-surface-elevated p-4 text-sm text-content-secondary"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="font-medium text-accent-ink">
                    Message not sent
                  </p>
                  <p className="mt-1">{formState.submitError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={formState.isSubmitting}
                className={cn(
                  "w-full rounded-control px-5 py-3 text-sm font-semibold transition-opacity active:translate-y-px",
                  formState.isSubmitting
                    ? "cursor-not-allowed bg-content-muted text-surface-page"
                    : "bg-surface-inverse text-content-inverse hover:opacity-90"
                )}
              >
                {formState.isSubmitting ? "Sending…" : "Send message"}
              </button>
            </form>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
