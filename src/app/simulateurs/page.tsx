import { redirect } from "next/navigation";

/** Redirection permanente vers /nos-outils (gérée aussi dans next.config) */
export default function SimulatorsRedirectPage() {
  redirect("/nos-outils");
}
