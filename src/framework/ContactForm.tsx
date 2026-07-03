"use client";

interface ContactFormProps {
  email: string;
  subjects: string[];
  trustNote: string;
}

export function ContactForm({ email, subjects, trustNote }: ContactFormProps) {
  return (
    <>
      <form className="ds-form" action={`mailto:${email}`} method="GET" encType="text/plain">
        <div>
          <label htmlFor="contact-name" className="ds-field-label">
            Nom
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            autoComplete="name"
            className="ds-input"
            placeholder="Votre nom"
          />
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
            className="ds-input"
            placeholder="exemple@email.fr"
          />
        </div>

        <div>
          <label htmlFor="contact-subject" className="ds-field-label">
            Sujet
          </label>
          <select id="contact-subject" name="subject" className="ds-select" defaultValue="">
            <option value="" disabled>
              Choisissez un sujet
            </option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="ds-field-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="body"
            className="ds-textarea"
            placeholder="Décrivez votre demande…"
          />
        </div>

        <button type="submit" className="ds-btn ds-btn--primary">
          Envoyer
        </button>
      </form>

      <p className="ds-form-trust">{trustNote}</p>
    </>
  );
}
