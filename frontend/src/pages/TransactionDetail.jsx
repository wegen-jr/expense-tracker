import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  X,
  Save,
  Receipt,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TransactionDetail({ type }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const isExpense = type === "expense";

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

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

  // -----------------------------
  // GET TRANSACTION
  // -----------------------------

  const getTransaction = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/api/${
          isExpense ? "expenses" : "incomes"
        }/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      setTransaction(data.data);

      setFormData({
        title: data.data.title || "",
        amount: data.data.amount || "",
        category: data.data.category || "",
        description: data.data.description || "",
        date: data.data.date
          ? data.data.date.split("T")[0]
          : "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransaction();
  }, [id, type]);

  // -----------------------------
  // HANDLE INPUT
  // -----------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // UPDATE
  // -----------------------------

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updateData = {
        title: formData.title,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date,
      };

      // Expense has category
      if (isExpense) {
        updateData.category = formData.category;
      }

      const res = await fetch(
        `http://localhost:5000/api/${
          isExpense ? "expenses" : "incomes"
        }/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(
        `${
          isExpense ? "Expense" : "Income"
        } updated successfully`
      );

      setTransaction(data.data);
      setEditing(false);

      await getTransaction();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update transaction");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // DELETE
  // -----------------------------

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${
        isExpense ? "expense" : "income"
      }?`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `http://localhost:5000/api/${
          isExpense ? "expenses" : "incomes"
        }/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(
        `${isExpense ? "Expense" : "Income"} deleted successfully`
      );

      navigate(
        isExpense ? "/expenses" : "/incomes"
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    } finally {
      setDeleting(false);
    }
  };

  // -----------------------------
  // DATE
  // -----------------------------

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // -----------------------------
  // LOADING
  // -----------------------------

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-800/10">
        <p className="font-serif text-gray-500">
          Loading transaction...
        </p>
      </div>
    );
  }

  // -----------------------------
  // NOT FOUND
  // -----------------------------

  if (!transaction) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-800/10 px-4">
        <p className="font-serif text-gray-500">
          Transaction not found.
        </p>

        <button
          onClick={() =>
            navigate(
              isExpense ? "/expenses" : "/incomes"
            )
          }
          className="rounded-2xl bg-blue-900 px-4 py-2 font-serif text-white"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-800/10 px-3 py-5 md:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-4xl">

        {/* HEADER */}

        <div
          className={`rounded-3xl p-4 shadow-lg md:p-6 ${
            isExpense
              ? "bg-green-700 shadow-green-300"
              : "bg-blue-900 shadow-blue-300"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() =>
                navigate(
                  isExpense ? "/expenses" : "/incomes"
                )
              }
              className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 font-serif text-white transition hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">
                Back
              </span>
            </button>

            <div className="flex items-center gap-2 text-white">
              {isExpense ? (
                <Receipt className="h-5 w-5" />
              ) : (
                <Wallet className="h-5 w-5" />
              )}

              <span className="font-serif font-bold">
                {isExpense
                  ? "Expense Details"
                  : "Income Details"}
              </span>
            </div>
          </div>
        </div>

        {/* DETAIL CARD */}

        {!editing ? (
          <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm md:p-6">

            {/* TITLE */}

            <div className="border-b pb-4">
              <p className="font-serif text-sm text-gray-500">
                Title
              </p>

              <h1 className="mt-1 break-words font-serif text-2xl font-bold text-gray-800">
                {transaction.title}
              </h1>
            </div>

            {/* DETAILS GRID */}

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <DetailItem
                label="Amount"
                value={`${Number(
                  transaction.amount
                ).toLocaleString()} birr`}
                highlight
              />

              <DetailItem
                label="Date"
                value={formatDate(transaction.date)}
                icon={<Calendar className="h-4 w-4" />}
              />

              {isExpense && (
                <DetailItem
                  label="Category"
                  value={transaction.category}
                />
              )}

              <DetailItem
                label="Description"
                value={
                  transaction.description ||
                  "No description"
                }
              />

            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                onClick={() => setEditing(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-900 px-4 py-3 font-serif font-semibold text-white transition hover:bg-blue-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 font-serif font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>
          </div>
        ) : (

          /* EDIT FORM */

          <form
            onSubmit={handleUpdate}
            className="mt-4 rounded-3xl bg-white p-4 shadow-sm md:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">
                Edit{" "}
                {isExpense ? "Expense" : "Income"}
              </h2>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {/* TITLE */}

              <div className="flex flex-col gap-1">
                <label className="font-serif font-semibold">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="rounded-2xl bg-blue-800/10 p-3 outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* AMOUNT */}

              <div className="flex flex-col gap-1">
                <label className="font-serif font-semibold">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  min="1"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  className="rounded-2xl bg-blue-800/10 p-3 outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* CATEGORY */}

              {isExpense && (
                <div className="flex flex-col gap-1">
                  <label className="font-serif font-semibold">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="rounded-2xl bg-blue-800/10 p-3 outline-none focus:ring-2 focus:ring-blue-800"
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* DATE */}

              <div className="flex flex-col gap-1">
                <label className="font-serif font-semibold">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="rounded-2xl bg-blue-800/10 p-3 outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="font-serif font-semibold">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="resize-none rounded-2xl bg-blue-800/10 p-3 outline-none focus:ring-2 focus:ring-blue-800"
                />
              </div>
            </div>

            {/* FORM BUTTONS */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-900 px-4 py-3 font-serif font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditing(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-200 px-4 py-3 font-serif font-semibold text-gray-800 hover:bg-gray-300"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>

            </div>
          </form>
        )}
      </div>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| DETAIL ITEM
|--------------------------------------------------------------------------
*/

function DetailItem({
  label,
  value,
  icon,
  highlight = false,
}) {
  return (
    <div className="rounded-2xl bg-gray-800/5 p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        {icon}
        <span className="font-serif">
          {label}
        </span>
      </div>

      <p
        className={`mt-2 break-words font-serif font-semibold ${
          highlight
            ? "text-xl text-green-600"
            : "text-gray-800"
        }`}
      >
        {value}
      </p>
    </div>
  );
}