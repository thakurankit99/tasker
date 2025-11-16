import type { AppProps } from "next/app";
import Head from "next/head";
import "@/styles/globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/contexts/auth-context";
import SetupChecker from "@/components/setup/SetupChecker";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AutomationLoader from "@/components/automation/AutomationLoader";
import ChatProvider from "@/contexts/chat-context";
import ChatPanel from "@/components/chat/ChatPanel";
import { Toaster } from "@/components/ui/sonner";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AadyaBoard - AI-Powered Project Management</title>
        <meta name="description" content="Transform your team's workflow with AadyaBoard's AI-powered project management platform" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <SetupChecker>
          <ChatProvider>
            <ProtectedRoute>
              <Component {...pageProps} />
            </ProtectedRoute>
            <ChatPanel />
          </ChatProvider>
        </SetupChecker>
      </AuthProvider>
      <AutomationLoader
        showDevPanel={process.env.NODE_ENV === "development"}
        enableConsoleAccess={true}
      />
      <Toaster expand={false} richColors closeButton />
      </ThemeProvider>
    </>
  );
}
