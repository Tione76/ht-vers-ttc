import { NextResponse } from "next/server";

const ALLOWED_SUBJECTS = [
  "Signaler une erreur",
  "Suggestion d'amélioration",
  "Autre demande",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function validatePayload(body: ContactPayload) {
  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name) return { error: "Le nom est obligatoire." };
  if (!email) return { error: "L'adresse e-mail est obligatoire." };
  if (!EMAIL_PATTERN.test(email)) return { error: "L'adresse e-mail n'est pas valide." };
  if (!subject || !ALLOWED_SUBJECTS.includes(subject as (typeof ALLOWED_SUBJECTS)[number])) {
    return { error: "Veuillez choisir un sujet valide." };
  }
  if (!message) return { error: "Le message est obligatoire." };

  return { name, email, subject, message };
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Le service d'envoi n'est pas configuré. Écrivez-nous à contact@ht-vers-ttc.fr." },
      { status: 503 },
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const validated = validatePayload(body);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { name, email, subject, message } = validated;
  const to = process.env.CONTACT_TO_EMAIL ?? "contact@ht-vers-ttc.fr";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "HT-VERS-TTC.FR <noreply@ht-vers-ttc.fr>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Contact HT-VERS-TTC.FR] ${subject}`,
      text: [
        `Nom : ${name}`,
        `E-mail : ${email}`,
        `Sujet : ${subject}`,
        "",
        message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessayez plus tard ou écrivez-nous directement par e-mail." },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
