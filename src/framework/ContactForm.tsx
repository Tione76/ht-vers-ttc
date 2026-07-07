"use client";

import { useState, type FormEvent } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormProps {
  subjects: string[];
  trustNote: string;
}

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm({ subjects, trustNote }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!name.trim()) errors.name = "Le nom est obligatoire.";
    if (!email.trim()) {
      errors.email = "L'adresse e-mail est obligatoire.";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      errors.email = "L'adresse e-mail n'est pas valide.";
    }
    if (!subject) errors.subject = "Veuillez choisir un sujet.";
    if (!message.trim()) errors.message = "Le message est obligatoire.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject,
          message: message.trim(),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFormError(data.error ?? "L'envoi a échoué. Réessayez plus tard.");
        return;
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setFieldErrors({});
    } catch {
      setFormError("L'envoi a échoué. Vérifiez votre connexion ou écrivez-nous directement par e-mail.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {success && (
        <p className="ds-form-feedback ds-form-feedback--success" role="status">
          Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.
        </p>
      )}

      {formError && (
        <p className="ds-form-feedback ds-form-feedback--error" role="alert">
          {formError}
        </p>
      )}

      <form className="ds-form" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="contact-name" className="ds-field-label">
            Nom
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            required
            className="ds-input"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" className="ds-field-error" role="alert">
              {fieldErrors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="ds-field-label">
            Adresse e-mail
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            autoComplete="email"
            required
            className="ds-input"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" className="ds-field-error" role="alert">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-subject" className="ds-field-label">
            Sujet
          </label>
          <select
            id="contact-subject"
            name="subject"
            className="ds-select"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-invalid={Boolean(fieldErrors.subject)}
            aria-describedby={fieldErrors.subject ? "contact-subject-error" : undefined}
          >
            <option value="" disabled>
              Choisissez un sujet
            </option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {fieldErrors.subject && (
            <p id="contact-subject-error" className="ds-field-error" role="alert">
              {fieldErrors.subject}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="contact-message" className="ds-field-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="ds-textarea"
            placeholder="Décrivez votre demande"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
          />
          {fieldErrors.message && (
            <p id="contact-message-error" className="ds-field-error" role="alert">
              {fieldErrors.message}
            </p>
          )}
        </div>

        <button type="submit" className="ds-btn ds-btn--primary" disabled={submitting}>
          {submitting ? "Envoi en cours…" : "Envoyer"}
        </button>
      </form>

      <p className="ds-form-trust">{trustNote}</p>
    </>
  );
}
