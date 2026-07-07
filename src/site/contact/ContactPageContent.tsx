import { ContactForm } from "@/framework/ContactForm";

interface ContactPageContentProps {
  email: string;
  subjects: string[];
  trustNote: string;
}

export function ContactPageContent({ email, subjects, trustNote }: ContactPageContentProps) {
  return (
    <div className="contact-page">
      <p className="contact-page__direct">
        Vous préférez nous écrire directement ? Envoyez un message à{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <ContactForm subjects={subjects} trustNote={trustNote} />
    </div>
  );
}
