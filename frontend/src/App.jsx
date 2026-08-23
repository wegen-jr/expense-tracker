import { BrowserRouter,Routes, Route  } from "react-router-dom";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import DashboardLayout from "./layout/PageLayout";
import ExpensePage from "./pages/ExpensePage";
import AddExpense from "./pages/AddExpense";
import IncomePage from "./pages/IncomePage";
import AddIncome from "./pages/AddIncome";
import Profile from "./pages/Profile";
import ReportPage from "./pages/ReportPage";
import TransactionDetail from "./pages/TransactionDetail";
import ForgotPassword from "./pages/ForgotPassword";
import Help from "./pages/Help";
function App() {

  return (
    <>
     <div>
      <BrowserRouter>
      <ToastContainer/>
        <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/register" element={<Registration/>}/>
            <Route path="/forgotPass" element={<ForgotPassword/>}/>

            <Route element={<ProtectedRoute/>}>
            <Route element={<DashboardLayout/>}>
              <Route path="/dashboard" element={<UserDashboard/>}/>
              <Route path="/expenses" element={<ExpensePage/>}/>
              <Route path="/add" element={<AddExpense/>}/>
              <Route path="/income" element={<IncomePage/>}/>
              <Route path="/addIncome" element={<AddIncome/>}/>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/reports" element={<ReportPage/>}/>
              <Route path="/expenses/:id" element={<TransactionDetail type="expense" />}/>
              <Route path="/incomes/:id" element={<TransactionDetail type="income" />}/>
              <Route path='/help' element={<Help/>}/>
            </Route>
            </Route>
        </Routes>
      </BrowserRouter>
        
     </div>
    </>
  )
}

export default App
