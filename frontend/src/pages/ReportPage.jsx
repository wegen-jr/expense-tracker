import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  CircleDollarSign,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReportPage() {
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [period, setPeriod] = useState("all");

  const getExpenses = async () => {
    try {
      setLoading(true);

      const res = await fetch(
            `${API_URL}/api/expenses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setExpenses(data.data);
      } else {
        setExpenses([]);
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  /*
   * -----------------------------
   * DATE FILTER
   * -----------------------------
   */

  const filteredExpenses = useMemo(() => {
    if (period === "all") {
      return expenses;
    }

    const now = new Date();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      if (period === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        return expenseDate >= weekAgo;
      }

      if (period === "month") {
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "year") {
        return expenseDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [expenses, period]);

  /*
   * -----------------------------
   * BASIC CALCULATIONS
   * -----------------------------
   */

  const totalExpense = useMemo(() => {
    return filteredExpenses.reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );
  }, [filteredExpenses]);

  const expenseCount = filteredExpenses.length;

  const averageExpense =
    expenseCount > 0 ? totalExpense / expenseCount : 0;

  const highestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    return filteredExpenses.reduce((highest, expense) =>
      Number(expense.amount) > Number(highest.amount)
        ? expense
        : highest
    );
  }, [filteredExpenses]);

  const lowestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return null;

    return filteredExpenses.reduce((lowest, expense) =>
      Number(expense.amount) < Number(lowest.amount)
        ? expense
        : lowest
    );
  }, [filteredExpenses]);

  /*
   * -----------------------------
   * CATEGORY REPORT
   * -----------------------------
   */

  const categoryReport = useMemo(() => {
    const result = {};

    filteredExpenses.forEach((expense) => {
      const category = expense.category;

      if (!result[category]) {
        result[category] = {
          total: 0,
          count: 0,
        };
      }

      result[category].total += Number(expense.amount || 0);
      result[category].count += 1;
    });

    return Object.entries(result)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage:
          totalExpense > 0
            ? (data.total / totalExpense) * 100
            : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [filteredExpenses, totalExpense]);

  const topCategory = categoryReport[0];

  /*
   * -----------------------------
   * MONTHLY REPORT
   * -----------------------------
   */

  const monthlyReport = useMemo(() => {
    const result = {};

    filteredExpenses.forEach((expense) => {
      const date = new Date(expense.date);

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!result[key]) {
        result[key] = {
          label,
          total: 0,
          count: 0,
        };
      }

      result[key].total += Number(expense.amount || 0);
      result[key].count += 1;
    });

    return Object.entries(result)
      .map(([key, value]) => ({
        key,
        ...value,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }, [filteredExpenses]);

  const highestMonth = useMemo(() => {
    if (monthlyReport.length === 0) return null;

    return monthlyReport.reduce((highest, month) =>
      month.total > highest.total ? month : highest
    );
  }, [monthlyReport]);

  /*
   * -----------------------------
   * RECENT EXPENSES
   * -----------------------------
   */

  const recentExpenses = useMemo(() => {
    return [...filteredExpenses]
      .sort(
        (a, b) =>
          new Date(b.date) - new Date(a.date)
      )
      .slice(0, 5);
  }, [filteredExpenses]);

  /*
   * -----------------------------
   * HELPERS
   * -----------------------------
   */

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  return (
    <div className="min-h-dvh bg-gray-800/10 px-3 py-5 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* HEADER */}
        <div className="mb-5 rounded-3xl bg-green-700 p-4 shadow-lg shadow-green-300 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="flex items-center gap-2 text-white">
                <ChartNoAxesCombined className="h-6 w-6" />
                <h1 className="font-serif text-2xl font-bold">
                  Expense Report
                </h1>
              </div>

              <p className="mt-1 font-serif text-sm text-white/80">
                Analyze your spending and understand where your
                money goes.
              </p>
            </div>

            <div className="relative">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none rounded-2xl bg-white px-4 py-2.5 pr-10 font-serif font-semibold text-gray-800 outline-none"
              >
                <option value="all">All time</option>
                <option value="week">Last 7 days</option>
                <option value="month">This month</option>
                <option value="year">This year</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>

          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl bg-white py-16 text-center font-serif text-gray-500">
            Loading report...
          </div>
        ) : (
          <>
            {/* SUMMARY CARDS */}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

              <ReportCard
                icon={<CircleDollarSign />}
                title="Total Expense"
                value={`${formatMoney(totalExpense)} birr`}
                subtitle={`${expenseCount} expenses`}
              />

              <ReportCard
                icon={<Receipt />}
                title="Average Expense"
                value={`${formatMoney(averageExpense)} birr`}
                subtitle="per transaction"
              />

              <ReportCard
                icon={<TrendingUp />}
                title="Highest Expense"
                value={
                  highestExpense
                    ? `${formatMoney(highestExpense.amount)} birr`
                    : "0 birr"
                }
                subtitle={
                  highestExpense
                    ? highestExpense.title
                    : "No expense"
                }
              />

              <ReportCard
                icon={<TrendingDown />}
                title="Lowest Expense"
                value={
                  lowestExpense
                    ? `${formatMoney(lowestExpense.amount)} birr`
                    : "0 birr"
                }
                subtitle={
                  lowestExpense
                    ? lowestExpense.title
                    : "No expense"
                }
              />

            </div>

            {/* CATEGORY REPORT + TOP SPENDING */}

            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

              {/* CATEGORY BREAKDOWN */}

              <div className="rounded-3xl bg-white p-4 shadow-sm lg:col-span-2">
                <div className="mb-4 flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  <h2 className="font-serif font-bold">
                    Spending by Category
                  </h2>
                </div>

                {categoryReport.length === 0 ? (
                  <p className="py-8 text-center font-serif text-gray-500">
                    No expense data available.
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {categoryReport.map((item) => (
                      <div key={item.category}>

                        <div className="mb-1 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="font-serif font-semibold">
                              {item.category}
                            </span>

                            <span className="ml-2 text-xs text-gray-500">
                              {item.count} expense
                              {item.count !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <span className="shrink-0 font-serif font-bold">
                            {formatMoney(item.total)} birr
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-blue-800"
                            style={{
                              width: `${item.percentage}%`,
                            }}
                          />
                        </div>

                        <div className="mt-1 text-right text-xs text-gray-500">
                          {item.percentage.toFixed(1)}%
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TOP CATEGORY */}

              <div className="rounded-3xl bg-blue-900 p-5 text-white shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <h2 className="font-serif font-bold">
                    Biggest Spending Area
                  </h2>
                </div>

                {topCategory ? (
                  <>
                    <p className="mt-8 font-serif text-sm text-white/70">
                      You spend the most on
                    </p>

                    <p className="mt-1 break-words font-serif text-3xl font-bold">
                      {topCategory.category}
                    </p>

                    <p className="mt-3 font-serif text-xl font-semibold">
                      {formatMoney(topCategory.total)} birr
                    </p>

                    <p className="mt-1 font-serif text-sm text-white/70">
                      {topCategory.percentage.toFixed(1)}% of your total
                      spending
                    </p>
                  </>
                ) : (
                  <p className="mt-8 font-serif text-white/70">
                    No category data available.
                  </p>
                )}
              </div>
            </div>

            {/* MONTHLY REPORT */}

            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">

              <div className="mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h2 className="font-serif font-bold">
                  Monthly Spending
                </h2>
              </div>

              {monthlyReport.length === 0 ? (
                <p className="py-8 text-center font-serif text-gray-500">
                  No monthly data available.
                </p>
              ) : (
                <div className="flex flex-col gap-4">

                  {monthlyReport.map((month) => {
                    const percentage =
                      highestMonth && highestMonth.total > 0
                        ? (month.total / highestMonth.total) * 100
                        : 0;

                    return (
                      <div key={month.key}>

                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-serif font-semibold">
                            {month.label}
                          </span>

                          <div className="text-right">
                            <span className="font-serif font-bold">
                              {formatMoney(month.total)} birr
                            </span>

                            <span className="ml-2 text-xs text-gray-500">
                              ({month.count})
                            </span>
                          </div>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-green-600"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}
            </div>

            {/* INSIGHTS */}

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <ArrowUp className="h-5 w-5 text-red-500" />
                  <h2 className="font-serif font-bold">
                    Highest Spending Month
                  </h2>
                </div>

                {highestMonth ? (
                  <div className="mt-4">
                    <p className="font-serif text-2xl font-bold">
                      {highestMonth.label}
                    </p>

                    <p className="mt-1 font-serif text-gray-500">
                      {formatMoney(highestMonth.total)} birr
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 font-serif text-gray-500">
                    No data available.
                  </p>
                )}
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  <h2 className="font-serif font-bold">
                    Transaction Activity
                  </h2>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-2xl bg-blue-800/10 p-3">
                    <p className="font-serif text-sm text-gray-500">
                      Total
                    </p>
                    <p className="mt-1 font-serif text-xl font-bold">
                      {expenseCount}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-green-800/10 p-3">
                    <p className="font-serif text-sm text-gray-500">
                      Average
                    </p>
                    <p className="mt-1 font-serif text-xl font-bold">
                      {formatMoney(averageExpense)}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* RECENT EXPENSES */}

            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  <h2 className="font-serif font-bold">
                    Recent Expenses
                  </h2>
                </div>

                <span className="rounded-full bg-blue-800/10 px-3 py-1 text-xs font-semibold text-gray-600">
                  {recentExpenses.length}
                </span>
              </div>

              {recentExpenses.length === 0 ? (
                <p className="py-8 text-center font-serif text-gray-500">
                  No expenses found.
                </p>
              ) : (
                <div className="flex flex-col gap-3">

                  {recentExpenses.map((expense) => (
                    <div
                      key={expense._id}
                      className="flex flex-col gap-3 rounded-2xl bg-gray-800/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="min-w-0">
                        <p className="break-words font-serif font-semibold">
                          {expense.title}
                        </p>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span>
                            {formatDate(expense.date)}
                          </span>

                          <span className="rounded-full bg-white px-2 py-1">
                            {expense.category}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 font-serif font-bold text-green-600">
                        {formatMoney(expense.amount)} birr
                      </div>

                    </div>
                  ))}

                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}


/*
 * --------------------------------
 * SUMMARY CARD
 * --------------------------------
 */

function ReportCard({
  icon,
  title,
  value,
  subtitle,
}) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800/10">
          {icon}
        </div>
      </div>

      <p className="mt-4 font-serif text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 break-words font-serif text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 break-words font-serif text-xs text-gray-500">
        {subtitle}
      </p>
    </div>
  );
}