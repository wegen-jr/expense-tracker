import {React, useState, useEffect} from 'react'
import {User, Bell, TrendingUp, TrendingDown, Info, Pin, Clock, Calendar} from 'lucide-react'
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { data } from 'react-router';

export default function UserDashboard() {
  const token = localStorage.getItem('token');
  const date = new Date();
  const [expenses, setExpenses] = useState([]); // Changed to plural for clarity
  const [loading, setLoading] = useState(true);
  const [summary,setSummary]=useState({});
  const [profile,setProfile]=useState({});
  const formatedDate = date.toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "long",  
      year: "numeric",  
    }
  );
  
  const getRecentExpense = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/expenses/recent', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setExpenses(data.data); // Now it's a flat array
        console.log('Expenses:', data.data);
      } else {
        toast.error(data.message);
      }
    } catch(e) {
      console.log(e);
      toast.error('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  }
  const getProfile=async ()=>{
     try{
            const res=await fetch('http://localhost:5000/api/user/profile',{
                method:'Get',
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${token}`
                }
            });
            const data=await res.json();
            console.log(data);
            if(data.success){
                toast.success(data.message);
                setProfile(data);

            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
            toast.error("failed to fetch") 
        }
  }
  const getSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/summary', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      
      if (data.success) {
        setSummary(data.data); // Now it's a flat array
        console.log('summary:', data.data);
      } else {
        toast.error(data.message);
      }
    } catch(e) {
      console.log(e);
      toast.error('Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getRecentExpense();
    getSummary();
  }, []);
  
  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  useEffect(()=>{
    getProfile();
  },[])
  
  return (
    <div>
      {/* mobile dashboard*/}
      <div className='flex flex-col'>
        <div className='bg-blue-900/100 flex flex-col rounded-b-3xl pb-5'>
          <div className='grid grid-cols-3 items-center gap-2 px-2 pt-5'>
            <div className='md:flex items-center gap-2 text-white'>
              <User className='md:h-15 md:w-15 w-10 h-10 rounded-full bg-white/10 md:p-3 p-2' />
              <span>welcome back, <span className='font-semibold text-lg font-serif'>{profile.firstName}</span> </span>
            </div>
            <div className='bg-white/10 rounded-2xl px-2 py-1 flex justify-center items-center'>
              <span className='text-white font-serif'>{formatedDate}</span>
            </div>
            <div className='flex justify-end text-white'>
              <Bell className='h-10 w-10 bg-white/10 rounded-full p-2'/>
            </div>
          </div>
          <div className='flex flex-col items-center justify-center text-white font-serif m-2'>
            <span>current balance</span>
            <span className='text-4xl font-semibold tracking-wider'>{summary.currentBalance} birr</span>
          </div>
        </div>
        
        <div className='bg-black/10 rounded-t-3xl p-2'>
          <div className='p-2 flex items-center gap-1'>
            <span className='font-serif font-semibold'>your money</span>
            <Info className='w-4 h-4'/>
          </div>
          
          <div className='grid grid-cols-2 items-center justify-start gap-3'>
            <div className='flex flex-col justify-start bg-white rounded-xl py-2 px-5'>
              <TrendingDown className='h-10 w-10 p-2 bg-gray-900/10 rounded-full mb-2'/>
              <div className='flex items-center gap-2'>
                <span className='capitalize font-serif'>income</span>
                <Info className='w-4 h-4'/>
              </div>
              <span className='font-serif font-bold'>{summary.totalIncome}birr</span>
            </div>
            <div className='flex flex-col justify-start bg-white rounded-xl py-2 px-5'>
              <TrendingUp className='h-10 w-10 p-2 bg-gray-900/10 rounded-full mb-2'/>
              <div className='flex items-center gap-2'>
                <span className='capitalize font-serif'>expense</span>
                <Info className='w-4 h-4'/>
              </div>
              <span className='font-serif font-bold'>{summary.totalExpense} birr</span>
            </div>
          </div>
          
          <div className='flex flex-col px-2 py-4'>
            <div className='grid grid-cols-2 items-center justify-start'>
              <span className='capitalize font-bold text-black font-serif'>expenses</span>
              <div className='flex items-center justify-end gap-2'>
                <Pin className='w-4 h-4'/>
                <Clock className='w-4 h-4'/>
                <span className='font-serif bg-blue-950/50 text-white rounded-2xl px-2'>for recent period</span>
              </div>
            </div>
            
            {/* Display each expense as a separate card - FLAT DATA */}
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
                    <div className='text-sm text-gray-500 font-serif flex items-center'>
                      <Calendar className='w-5 h-5'/>
                       {formatDate(expense.date)}
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
                  No recent expenses found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}