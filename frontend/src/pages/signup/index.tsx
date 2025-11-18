import Head from "next/head";
import { InvitedUserSignupForm } from "@/components/signup/InvitedUserSignupForm";

export default function InvitedSignupPage() {
  return (
    <>
      <Head>
        <title>Join Team - AadyaBoard</title>
        <meta name="description" content="Accept your invitation and join your team on AadyaBoard" />
      </Head>
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
        <InvitedUserSignupForm />
      </div>
    </>
  );
}

