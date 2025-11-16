import Head from "next/head";
import { ModeToggle } from "@/components/header/ModeToggle";
import { SetupContent } from "@/components/setup/SetupContent";
import { SetupForm } from "@/components/setup/SetupForm";

export default function SetupPage() {
  return (
    <>
      <Head>
        <title>Setup - AadyaBoard</title>
        <meta name="description" content="Set up your AadyaBoard organization and get started" />
      </Head>
      <div className="min-h-screen bg-[var(--background)]">
      <div className="login-container">
        <div className="login-content-panel hidden md:block">
          <SetupContent />
        </div>
        <div className="login-form-mode-toggle">
          <ModeToggle />
        </div>
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <SetupForm />
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
