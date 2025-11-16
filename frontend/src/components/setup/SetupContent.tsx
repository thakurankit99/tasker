import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Shield } from "lucide-react";

export function SetupContent() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="setup-hero-container">
      {/* Main Content */}
      <div className="setup-hero-content">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="setup-brand-header"
        >
          <div className="">
            <div className="flex items-center">
              <Image
                src={resolvedTheme === "light" ? "/aadya-logo-white.svg" : "/aadya-logo-dark.svg"}
                alt="AadyaBoard Logo"
                width={120}
                height={120}
                className="size-16 lg:size-24"
              />
              <h1 className="setup-brand-title">AadyaBoard</h1>
            </div>
            <p className="text-sm text-[var(--primary-foreground)]/70 mt-1">by Aadya Technovate</p>
          </div>

          <h2 className="setup-hero-heading">
            Begin your
            <br />
            <span className="setup-hero-heading-gradient">productivity journey</span>
          </h2>

          <p className="setup-hero-description">
            Set up your super admin account to unlock the full power of AadyaBoard's
            AI-powered project management platform for your entire organization.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
