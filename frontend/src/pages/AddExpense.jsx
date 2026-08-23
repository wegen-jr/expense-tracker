import { useState } from "react";
import {Link, useNavigate} from "react-router-dom"
import { ArrowLeft,FileText,CircleDollarSign,Tag,Calendar } from "lucide-react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AddExpense(){
      const [active, setActive] = useState("expenses");
const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "Food",
    "Transport",
    "Education",
    "Entertainment",
    "Bills",
    "Shopping",
    "Health",
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

    if (!form.title || !form.amount || !form.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/expenses/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            amount: Number(form.amount),
            category: form.category,
            description: form.description,
            ...(form.date && { date: form.date }),
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Expense added successfully.");

        setForm({
          title: "",
          amount: "",
          category: "",
          description: "",
          date: "",
        });

        navigate("/expenses");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense.");
    } finally {
      setLoading(false);
    }
  };
  const handleNavigation=(path)=>{
    setActive(path);
    if(path==='expenses'){
    navigate('/add')
}else{
    navigate('/addIncome')
}
  }
    return(
      <div className="bg-gray-800/10 flex flex-col px-2">
        <div className='flex justify-center py-2 '>
            <nav className="relative flex w-fit rounded-2xl bg-gray-100 py-1 px-3  ">
            {/* Animated background */}
            <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out ${
                active === "income" ? "translate-x-full" : "translate-x-0"
                }`}
            />

            <button
                onClick={() => handleNavigation("expenses")}
                className={`relative z-10 w-32 px-4 py-2 text-sm font-medium transition-colors capitalize duration-300 ${
                active === "expenses"
                    ? "text-black"
                    : "text-gray-500"
                }`}
            >
                expenses
            </button>

            <button
                onClick={() => handleNavigation("income")}
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
        <div className={`${active==='income'?'hidden':'block'}`}>
        <div className='mb-4 flex items-center justify-between bg-white rounded-2xl py-2 px-3'>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Add Expense
          </h1>

          <p className="font-serif text-sm text-gray-500">
            Record a new expense
          </p>
        </div>

        <Link
          to="/expenses"
          className="flex items-center gap-1 rounded-xl bg-white px-3 py-2 font-serif text-sm text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white p-4 shadow-sm md:p-6"
      >

        {/* Title */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <FileText className="h-4 w-4" />
            Expense title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Dinner with friends"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          />
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
              min="1"
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

        {/* Category */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <Tag className="h-4 w-4" />
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          >
            <option value="">Select category</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="mb-1 flex items-center gap-2 font-serif text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4" />
            Expense date
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
          <label className="mb-1 font-serif text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="What was this expense for?"
            rows="4"
            maxLength="50"
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 font-serif outline-none transition focus:border-blue-800 focus:ring-2 focus:ring-blue-800/10"
          />

          <p className="mt-1 text-right font-serif text-xs text-gray-400">
            {form.description.length}/50
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-900 px-4 py-3 font-serif font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Adding expense..." : "Add Expense"}
        </button>
      </form>
      </div>
      </div>
)}