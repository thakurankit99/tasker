import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  User,
  Lock,
  CheckCircle2,
  Mail,
  Building2,
} from "lucide-react";
import { useTheme } from "next-themes";
import { invitationApi } from "@/utils/api/invitationsApi";
import { toast } from "sonner";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function InvitedUserSignupForm() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const searchParams = useSearchParams();
  const { register } = useAuth();

  const initialEmail = searchParams.get("email") ?? "";
  const [invitationData, setInvitationData] = useState<any>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: initialEmail,
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load invitation details
  useEffect(() => {
    const loadInvitation = async () => {
      const token = localStorage.getItem("pendingInvitation");
      if (!token) {
        router.push("/register");
        return;
      }

      try {
        const res = await invitationApi.verifyInvitation(token);
        if (!res.isValid) {
          toast.error("Invalid or expired invitation");
          router.push("/register");
          return;
        }
        setInvitationData(res.invitation);
        setFormData((prev) => ({ ...prev, email: res.invitation.email }));
      } catch (err) {
        toast.error("Failed to load invitation");
        router.push("/register");
      } finally {
        setIsLoadingInvitation(false);
      }
    };

    loadInvitation();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const isPasswordValid = formData.password.length >= 8;
  const passwordsMatch = formData.password === formData.confirmPassword;
  const isFormValid = formData.firstName.trim() && isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    setError("");

    try {
      // Register the user
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      };

      const response = await register(userData);

      if (response.access_token) {
        // Accept the invitation
        const token = localStorage.getItem("pendingInvitation");
        if (token) {
          try {
            await invitationApi.acceptInvitation(token);
            localStorage.removeItem("pendingInvitation");
            toast.success("Welcome to the team!");
          } catch (err) {
            console.error("Failed to accept invitation:", err);
          }
        }
        router.push("/dashboard");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInvitation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const getEntityName = () => {
    if (invitationData?.organization) return invitationData.organization.name;
    if (invitationData?.workspace) return invitationData.workspace.name;
    if (invitationData?.project) return invitationData.project.name;
    return "the team";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-[var(--border)] shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-2">
            <Image
              src={resolvedTheme === "light" ? "/aadya-logo-dark.svg" : "/aadya-logo-white.svg"}
              alt="AadyaBoard Logo"
              width={80}
              height={80}
              className="size-16"
            />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Join {getEntityName()}</CardTitle>
            <CardDescription className="mt-2">
              You've been invited to join <strong>{getEntityName()}</strong> on AadyaBoard
            </CardDescription>
          </div>
          {invitationData && (
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)] bg-[var(--muted)] p-3 rounded-lg">
              <Building2 className="h-4 w-4" />
              <span>
                Invited by <strong>{invitationData.inviter?.firstName} {invitationData.inviter?.lastName}</strong>
              </span>
            </div>
          )}
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-[var(--muted)] cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="border-[var(--border)]"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="border-[var(--border)]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="border-[var(--border)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <div className="flex items-center gap-2 text-xs">
                  {isPasswordValid ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-amber-500" />
                  )}
                  <span className={isPasswordValid ? "text-green-600" : "text-amber-600"}>
                    {isPasswordValid ? "Strong password" : "At least 8 characters required"}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="border-[var(--border)] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="flex items-center gap-2 text-xs">
                  {passwordsMatch ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span className={passwordsMatch ? "text-green-600" : "text-red-600"}>
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Join Team"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

