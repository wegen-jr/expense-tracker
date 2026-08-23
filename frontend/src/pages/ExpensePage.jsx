import {React,useState, useEffect} from 'react'
import { Link,useNavigate } from "react-router-dom";
import { Info , Calendar, ArrowBigRight} from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';

export default function ExpensePage() {
      const [active, setActive] = useState("expenses");
      const [expenses,setExpenses]=useState([]);
      const [loading, setLoading]=useState(false);
      const token=localStorage.getItem('token');
      const navigate=useNavigate()
      const API_URL = import.meta.env.VITE_API_URL;
      const [filters, setFilters] = useState({
        category: "",
        minAmount: "",
        maxAmount: "",
        startDate: "",
        endDate: "",
        });

      const filterOptions = [{
    name: "Category",
    key: "category",
    type: "select",
    options: [
      { label: "All categories", value: "" },
      { label: "Food", value: "Food" },
      { label: "Transport", value: "Transport" },
      { label: "Education", value: "Education" },
      { label: "Entertainment", value: "Entertainment" },
      { label: "Bills", value: "Bills" },
      { label: "Shopping", value: "Shopping" },
      { label: "Health", value: "Health" },
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
    placeholder: "e.g. 500",
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
  }
];

      const getExpenses = async () => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.append(key, value);
    }
  });

  const res = await fetch(
    `${API_URL}/api/expenses?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (data.success) {
    setExpenses(data.data);
  }else{
    setExpenses([])
  }
};
        
        const totalEXpense=()=>{
            let total=0;
            expenses.map((expense)=>{
                total+=expense.amount
            });
            return total;
        }
        
        useEffect(() => {
          getExpenses();
          console.log(filters);
        }, [filters]);

          // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  const handleNavigation=(path)=>{
    setActive(path);
    navigate(`/${path}`)
  }
  return (
    <div className='bg-gray-800/10 flex flex-col'>
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
        
        
        <div className={`p-2 flex flex-col gap-1
            ${
                active==="income"?'hidden':"block"
            }
            `}>
                <div className='grid grid-cols-2 px-2 '>
                    <div className='flex items-center '>
                        <span className='font-serif font-semibold capitalize'>All expenses</span>
                        <Info className='w-4 h-4'/> 
                    </div>
                  <div className='flex justify-end items-center'>
                            <span className=' rounded-2xl bg-blue-800/10 px-2 py-1 text-center font-serif font-semibold '>total expenses =<span className='text-green-400 font-semibold'>{totalEXpense()}</span></span>

                  </div>
                </div>
               <div className="flex flex-wrap gap-3 bg-white px-2 py-2 rounded-2xl font-serif">
                    {filterOptions.map((filter) => (
                        <div key={filter.key} className="flex flex-col gap-1">
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
                                <option key={option.value} value={option.value}>
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
                <div className='flex flex-col gap-3 mt-3'>
                              {loading ? (
                                <div className='text-center text-gray-500 font-serif py-8'>
                                  Loading expenses...
                                </div>
                              ) : expenses.length > 0 ? (
                                expenses.map((expense) => (
                                  <div 
                                    key={expense._id} 
                                    className='bg-white px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow'
                                  >
                                    {/* Date */}
                                    <div className='text-sm text-gray-500 font-serif flex items-center justify-between'>
                                      <Calendar className='w-5 h-5'/>
                                       {formatDate(expense.date)}
                                       <span className='hover:text-gray-400 hover:underline text-green-600'><Link to={`/expenses/${expense._id}`} className='hover:underline'>details</Link> <ArrowBigRight className='w-3 h-3'/>  </span>
                                    </div>
                                    
                                    {/* Expense details */}
                                    <div className='flex items-center justify-between mt-2'>
                                      <div className='flex-1'>
                                        <h4 className='font-serif font-semibold text-gray-800'>
                                          {expense.title}
                                        </h4>
                                        {expense.description && (
                                          <p className='text-sm text-gray-500 font-serif mt-1'>
                                            {expense.description}
                                          </p>
                                        )}
                                      </div>
                                      <div className='text-right ml-4'>
                                        <p className='font-serif font-bold text-green-600'>
                                          {expense.amount} birr
                                        </p>
                                        <p className='text-xs bg-gray-100 px-2 py-1 rounded-full font-serif mt-1'>
                                          {expense.category}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className='text-center text-gray-500 font-serif py-8'>
                                  No expenses found
                                </div>
                              )}
                            </div>
   
        </div>

    </div>
  )
}
