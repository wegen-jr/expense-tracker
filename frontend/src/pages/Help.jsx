import {
  CircleHelp,
  Wallet,
  Receipt,
  Filter,
  ChartNoAxesCombined,
  User,
  LockKeyhole,
  Pencil,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const sections = [
  {
    title: "Getting started",
    icon: Wallet,
    content: [
      {
        question: "How do I add an expense?",
        answer:
          "Open the Expenses page, enter the title, amount, category, description, and date, then submit the form. The expense will be associated with your account.",
      },
      {
        question: "How do I add income?",
        answer:
          "Open the Income page and enter the income source, amount, description, and date. Your income is stored separately from your expenses.",
      },
    ],
  },
  {
    title: "Expenses and income",
    icon: Receipt,
    content: [
      {
        question: "Can I edit a transaction?",
        answer:
          "Yes. Open the transaction details page and select Edit. You can change the fields you need without changing the other information.",
      },
      {
        question: "Can I delete a transaction?",
        answer:
          "Yes. Open the transaction details page and select Delete. The transaction will be permanently removed from your account.",
      },
      {
        question: "Why can't I see another user's transaction?",
        answer:
          "Transactions belong to the account that created them. Your account can only access its own expenses and income.",
      },
    ],
  },
  {
    title: "Filtering",
    icon: Filter,
    content: [
      {
        question: "How does expense filtering work?",
        answer:
          "You can filter expenses by category, minimum amount, maximum amount, start date, and end date. Multiple filters can be combined.",
      },
      {
        question: "How does amount filtering work?",
        answer:
          "Minimum amount shows transactions greater than or equal to the value. Maximum amount shows transactions less than or equal to the value. Using both creates an amount range.",
      },
      {
        question: "How does date filtering work?",
        answer:
          "Start date sets the beginning of the search period, while end date sets the end of the period. You can use either one independently or use both together.",
      },
    ],
  },
  {
    title: "Reports",
    icon: ChartNoAxesCombined,
    content: [
      {
        question: "What does total expense mean?",
        answer:
          "It is the sum of all expense amounts included in the selected report period.",
      },
      {
        question: "What is average expense?",
        answer:
          "Average expense is calculated by dividing the total expense by the number of expenses.",
      },
      {
        question: "What does spending by category show?",
        answer:
          "It groups your expenses by category and shows how much each category contributes to your total spending.",
      },
      {
        question: "What is the highest spending category?",
        answer:
          "It is the category containing the largest total amount of expenses during the selected period.",
      },
    ],
  },
  {
    title: "Account and security",
    icon: User,
    content: [
      {
        question: "How do I update my profile?",
        answer:
          "Open your Profile page and enter only the information you want to change. Fields that you leave unchanged remain unchanged.",
      },
      {
        question: "How do I change my password?",
        answer:
          "Use the password fields on your Profile page or the password reset flow. Your password is stored as a hash rather than as plain text.",
      },
      {
        question: "What happens when I log out?",
        answer:
          "Your authentication token is removed from the browser, so protected pages and API requests can no longer use that token.",
      },
    ],
  },
];

function HelpItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="font-serif font-semibold text-gray-800">
          {question}
        </span>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-serif text-sm leading-6 text-gray-500">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Help() {
  return (
    <div className="min-h-dvh bg-gray-800/10 px-3 py-5 md:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* Header */}
        <div className="rounded-3xl bg-blue-900 p-5 text-white shadow-lg shadow-blue-300 md:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <CircleHelp className="h-6 w-6" />
            </div>

            <div>
              <h1 className="font-serif text-2xl font-bold md:text-3xl">
                Help Center
              </h1>

              <p className="mt-1 font-serif text-sm text-white/70">
                Learn how to use Smart Expense Tracker.
              </p>
            </div>
          </div>
        </div>

        {/* Intro */}
        <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-serif text-xl font-bold text-gray-800">
            How can we help?
          </h2>

          <p className="mt-2 max-w-3xl font-serif text-sm leading-6 text-gray-500">
            Smart Expense Tracker helps you record your income and
            expenses, find transactions quickly, and understand your
            spending habits through reports.
          </p>
        </div>

        {/* Sections */}
        <div className="mt-4 flex flex-col gap-4">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-3xl bg-white p-5 shadow-sm md:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-800/10">
                    <Icon className="h-5 w-5 text-blue-900" />
                  </div>

                  <h2 className="font-serif text-lg font-bold text-gray-800">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-3">
                  {section.content.map((item) => (
                    <HelpItem
                      key={item.question}
                      question={item.question}
                      answer={item.answer}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-4 rounded-3xl bg-green-700 p-5 text-white shadow-lg shadow-green-300 md:p-6">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-1 h-5 w-5 shrink-0" />

            <div>
              <h2 className="font-serif font-bold">
                Keep your account secure
              </h2>

              <p className="mt-1 font-serif text-sm leading-6 text-white/80">
                Never share your password or authentication token with
                anyone. Log out when using a shared device.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}