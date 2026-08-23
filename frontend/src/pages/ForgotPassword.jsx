import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const verifyEmail = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Email verified");
        setStep("password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill both password fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
            `${API_URL}/api/auth/reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
            confirmPassword,
          }),
        }
      );

      const data = await res.json();
      console.log(data)
      if (data.success) {
        toast.success("Password updated successfully");

        setEmail("");
        setPassword("");
        setConfirmPassword("");

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-800/10 px-4 py-8">
      <div className="w-full max-w-md">

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

          {/* Header */}
          <div className="bg-green-900 p-6 text-white sm:p-8">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

            <div className="mt-8 flex flex-col items-center text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                {step === "email" ? (
                  <Mail className="h-8 w-8" />
                ) : (
                  <ShieldCheck className="h-8 w-8" />
                )}
              </div>

              <h1 className="mt-4 font-serif text-2xl font-bold">
                {step === "email"
                  ? "Forgot Password?"
                  : "Reset Password"}
              </h1>

              <p className="mt-2 max-w-sm font-serif text-sm text-white/70">
                {step === "email"
                  ? "Enter your account email to continue."
                  : "Create a new password for your account."}
              </p>

            </div>
          </div>

          {/* STEP 1 */}
          {step === "email" && (
            <form
              onSubmit={verifyEmail}
              className="p-6 sm:p-8"
            >
              <div className="flex flex-col gap-2">

                <label className="font-serif font-semibold">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Enter your email"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-2xl bg-green-900 px-4 py-3 font-serif font-bold text-white transition hover:bg-green-800 disabled:opacity-60"
              >
                {loading
                  ? "Checking..."
                  : "Verify Email"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === "password" && (
            <form
              onSubmit={resetPassword}
              className="flex flex-col gap-4 p-6 sm:p-8"
            >

              <div className="rounded-2xl bg-green-800/10 p-3">
                <p className="font-serif text-sm text-gray-600">
                  Account:
                </p>

                <p className="break-all font-serif font-semibold">
                  {email}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold">
                  New password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-blue-900 px-4 py-3 font-serif font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
              >
                {loading
                  ? "Updating..."
                  : "Update Password"}
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}