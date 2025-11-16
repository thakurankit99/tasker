import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";

export function LoginContent() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="login-hero-container">
      {/* Main Content */}
      <div className="login-hero-content">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="login-brand-header"
        >
          <div className="">
            <div className="flex items-center">
              <Image
                src={resolvedTheme === "light" ? "/aadya-logo-dark.svg" : "/aadya-logo-white.svg"}
                alt="AadyaBoard Logo"
                width={80}
                height={80}
                className="size-10 lg:size-16"
              />
              <h1 className="login-brand-title">AadyaBoard</h1>
            </div>
            <p className="text-sm text-[var(--primary-foreground)]/70 mt-1">by Aadya Technovate</p>
          </div>

          <h2 className="login-hero-heading">
            Transform your
            <br />
            <span className="login-hero-heading-gradient">team's workflow</span>
          </h2>

          <p className="login-hero-description">
            Experience the future of project management with AI-powered tools that adapt to your
            team's unique workflow and boost productivity.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
