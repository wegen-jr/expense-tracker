import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../LoginNavbar";

export default function Registration() {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.firstName.length < 4 ||
      formData.lastName.length < 4
    ) {
      toast.error("Names must be at least 4 characters");
      return;
    }

    if (
      formData.email.length < 14 ||
      formData.email.length > 25
    ) {
      toast.error("Email must be between 14 and 25 characters");
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 14
    ) {
      toast.error("Password must be between 8 and 14 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/auth/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/");
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

          {/* BRANDING */}
          <div className="hidden bg-green-900 p-10 text-white md:flex md:flex-col md:justify-center lg:p-14">
            <p className="font-serif text-sm uppercase tracking-[0.25em] text-green-300">
              Smart Expense Tracker
            </p>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight lg:text-5xl">
              Start taking control of your money.
            </h1>

            <p className="mt-5 max-w-md font-serif text-lg text-white/70">
              Track your expenses, monitor your income,
              and understand your financial habits.
            </p>

            <div className="mt-10 h-1 w-20 rounded-full bg-green-400" />

            <Link
              to="/"
              className="mt-10 inline-flex w-fit items-center gap-2 font-serif text-sm text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>

          {/* FORM */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">

            <div className="mb-7">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900/10">
                <UserPlus className="h-7 w-7 text-blue-900" />
              </div>

              <h1 className="font-serif text-3xl font-bold text-gray-800">
                Create account
              </h1>

              <p className="mt-2 font-serif text-sm text-gray-500">
                Create your account and start tracking your finances.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >

              {/* FIRST NAME */}
              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold text-gray-700">
                  First name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* LAST NAME */}
              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold text-gray-700">
                  Last name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="font-serif font-semibold text-gray-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="flex flex-col gap-2">
                <label className="font-serif font-semibold text-gray-700">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                  <input
                    type="password"
                    required
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="w-full rounded-2xl bg-blue-800/10 py-3 pl-11 pr-4 font-serif outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-green-900 px-4 py-3 font-serif font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <UserPlus className="h-4 w-4" />

                {loading
                  ? "Creating account..."
                  : "Create Account"}
              </button>

            </form>

            {/* LOGIN LINK */}
            <div className="mt-6 text-center">
              <span className="font-serif text-sm text-gray-500">
                Already have an account?{" "}
              </span>

              <Link
                to="/"
                className="font-serif text-sm font-semibold text-blue-900 hover:underline"
              >
                Sign in
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}