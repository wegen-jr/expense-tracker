import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  CircleDollarSign,
  FileText,
  BriefcaseBusiness,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddIncome() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("income");
  
  const navigate = useNavigate();

  const [form, setForm] = useState({
    source: "",
    amount: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const sources = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.source || !form.amount) {
      toast.error("Please fill in source and amount.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/incomes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            source: form.source,
            amount: Number(form.amount),
            description: form.description,
            ...(form.date && {
              date: form.date,
            }),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Income added successfully.");

        setForm({
          source: "",
          amount: "",
          description: "",
          date: "",
        });

        navigate("/income");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add income.");
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation=(path)=>{
    setActive(path);
    if(path==='income'){
        navigate('/addIncome')
}else{
    navigate('/add')
}
  }

  return (
    <div className=" bg-gray-800/10 flex flex-col px-3">
        <div className='flex justify-center py-2'>
            <nav className="relative flex w-fit rounded-2xl bg-gray-100 py-1 px-3  ">
            {/* Animated background */}
            <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out ${
                active === "income" ? "translate-x-full" : "translate-x-0"
                }`}
            />

            <button
                onClick={() =>handleNavigation('expenses')}
                className={`relative z-10 w-32 px-4 py-2 text-sm font-medium transition-colors capitalize duration-300 ${
                active === "expenses"
                    ? "text-black"
                    : "text-gray-500"
                }`}
            >
                expenses
            </button>

            <button
                onClick={() => handleNavigation('income')}
                className={`relative z-10 w-32 px-4 py-2 text-sm font-medium transition-colors capitalize duration-300 ${
                active === "income"
                    ? "text-black"
                    : "text-gray-500"
                }`}
            >
                Income
            </button>
            </nav>
        </div>
      {/* Header */}
      <div className=" flex items-center justify-between bg-white py-2 px-3 rounded-2xl mb-3">

        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Add Income
          </h1>

          <p className="font-serif text-sm text-gray-500">
            Record money you received
          </p>
        </div>

        <Link
          to="/income"
          className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-serif text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-4 shadow-sm md:p-6"
      >

        {/* Source */}
        <div className="mb-4">

          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <BriefcaseBusiness className="h-4 w-4" />
            Income source
          </label>

          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          >
            <option value="">
              Select source
            </option>

            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>

        </div>

        {/* Amount */}
        <div className="mb-4">

          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <CircleDollarSign className="h-4 w-4" />
            Amount
          </label>

          <div className="relative">

            <input
              type="number"
              name="amount"
              min="0"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-16 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-serif text-sm text-gray-400">
              birr
            </span>

          </div>

        </div>

        {/* Date */}
        <div className="mb-4">

          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4" />
            Income date
          </label>

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          />

        </div>

        {/* Description */}
        <div className="mb-6">

          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <FileText className="h-4 w-4" />
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe this income..."
            rows="4"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          />

        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-900 px-4 py-3 font-serif font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding income..." : "Add Income"}
        </button>

      </form>
    </div>
  );
}