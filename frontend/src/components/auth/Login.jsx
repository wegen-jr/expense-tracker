import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../LoginNavbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (email.length < 14 || email.length > 25) {
      toast.error("Email must be between 14 and 25 characters");
      return;
    }

    if (password.length < 8 || password.length > 14) {
      toast.error("Password must be between 8 and 14 characters");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      localStorage.setItem("token", data.token);

      toast.success(data.message);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-blue-950">
      <Navbar />

      <main className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">

          {/* LOGIN FORM */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">

            <div className="mb-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-900/10">
                <LogIn className="h-7 w-7 text-blue-900" />
              </div>

              <h1 className="font-serif text-3xl font-bold text-gray-800">
                Welcome back
              </h1>

              <p className="mt-2 font-serif text-sm text-gray-500">
                Sign in to continue managing your money.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none transition focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none transition focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* FORGOT */}
              <div className="flex justify-end">
                <Link
                  to="/forgotPass"
                  className="font-serif text-sm font-semibold text-blue-900 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-green-900 px-4 py-3 font-serif font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />

                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* REGISTER */}
            <div className="mt-6 text-center">
              <span className="font-serif text-sm text-gray-500">
                Don't have an account?{" "}
              </span>

              <Link
                to="/register"
                className="inline-flex items-center gap-1 font-serif text-sm font-semibold text-blue-900 hover:underline"
              >
                Register
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* DESKTOP BRANDING */}
          <div className="hidden bg-green-900 p-10 text-white md:flex md:flex-col md:justify-center lg:p-14">
            <p className="font-serif text-sm uppercase tracking-[0.25em] text-green-300">
              Smart Expense Tracker
            </p>

            <h2 className="mt-5 font-serif text-4xl font-bold leading-tight lg:text-5xl">
              Know where your money goes.
            </h2>

            <p className="mt-5 max-w-md font-serif text-lg text-white/70">
              Take control of where it takes you.
            </p>

            <div className="mt-10 h-1 w-20 rounded-full bg-green-400" />
          </div>

        </div>
      </main>
    </div>
  );
}