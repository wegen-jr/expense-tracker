import { useEffect, useState } from "react";
import {
  Info,
  Calendar,
  ArrowBigRight,
  Plus,
} from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function IncomePage() {
  const token = localStorage.getItem("token");
  const [active, setActive] = useState("income");

  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const [filters, setFilters] = useState({
    source: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const filterOptions = [
    {
      name: "Source",
      key: "source",
      type: "select",
      options: [
        { label: "All sources", value: "" },
        { label: "Salary", value: "Salary" },
        { label: "Freelance", value: "Freelance" },
        { label: "Business", value: "Business" },
        { label: "Investment", value: "Investment" },
        { label: "Gift", value: "Gift" },
        { label: "Other", value: "Other" },
      ],
    },
    {
      name: "Minimum amount",
      key: "minAmount",
      type: "number",
      placeholder: "e.g. 100",
    },
    {
      name: "Maximum amount",
      key: "maxAmount",
      type: "number",
      placeholder: "e.g. 5000",
    },
    {
      name: "Start date",
      key: "startDate",
      type: "date",
    },
    {
      name: "End date",
      key: "endDate",
      type: "date",
    },
  ];

  const getIncome = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const res = await fetch(
        `http://localhost:5000/api/incomes?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setIncomes(data.data);
      } else {
        setIncomes([]);
      }

    } catch (error) {
      console.error(error);
      setIncomes([]);
      toast.error("Failed to fetch income");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIncome();
  }, [filters]);

  const totalIncome = () => {
    return incomes.reduce(
      (total, income) => total + income.amount,
      0
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
const handleNavigation=(path)=>{
    setActive(path);
    navigate(`/${path}`)
  }
  return (
    <div className="bg-gray-800/10 flex flex-col ">
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
      <div className="grid grid-cols-2 items-center px-2 py-3">

        <div className="flex items-center">
          <span className="font-serif font-semibold capitalize">
            All income
          </span>

          <Info className="ml-1 h-4 w-4" />
        </div>

        <div className="flex items-center justify-end gap-2">

          <span className="rounded-2xl bg-blue-800/10 px-2 py-1 text-center font-serif font-semibold">
            total income =
            <span className="ml-1 text-green-500">
              {totalIncome()} birr
            </span>
          </span>

         

        </div>

      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 rounded-2xl bg-white px-2 py-3 font-serif ">

        {filterOptions.map((filter) => (

          <div
            key={filter.key}
            className="flex flex-col gap-1"
          >

            <label className="text-sm font-medium">
              {filter.name}
            </label>

            {filter.type === "select" ? (

              <select
                value={filters[filter.key]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [filter.key]: e.target.value,
                  })
                }
                className="rounded-lg border px-3 py-2"
              >

                {filter.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}

              </select>

            ) : (

              <input
                type={filter.type}
                placeholder={filter.placeholder}
                value={filters[filter.key]}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    [filter.key]: e.target.value,
                  })
                }
                className="rounded-lg border px-3 py-2"
              />

            )}

          </div>

        ))}

      </div>

      {/* Income list */}
      <div className="mt-3 flex flex-col gap-3">

        {loading ? (

          <div className="py-8 text-center font-serif text-gray-500">
            Loading income...
          </div>

        ) : incomes.length > 0 ? (

          incomes.map((income) => (

            <div
              key={income._id}
              className="rounded-2xl bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
            >

              {/* Date */}
              <div className="flex items-center justify-between font-serif text-sm text-gray-500">

                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />

                  {formatDate(income.date)}
                </div>

                <Link
                  to={`/incomes/${income._id}`}
                  className="flex items-center gap-1 text-green-600 hover:underline"
                >
                  details

                  <ArrowBigRight className="h-3 w-3" />
                </Link>

              </div>

              {/* Income information */}
              <div className="mt-2 flex items-center justify-between">

                <div className="flex-1">

                  <h4 className="font-serif font-semibold text-gray-800">
                    {income.source}
                  </h4>

                  {income.description && (
                    <p className="mt-1 font-serif text-sm text-gray-500">
                      {income.description}
                    </p>
                  )}

                </div>

                <div className="ml-4 text-right">

                  <p className="font-serif font-bold text-green-600">
                    +{income.amount} birr
                  </p>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="py-8 text-center font-serif text-gray-500">
            No income found
          </div>

        )}

      </div>

    </div>
  );
}