import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute(){
    const token=localStorage.getItem('token');
    if(!token){
        return <Navigate to={'/'} replace/>
    }
      try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.removeItem("token");
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" replace />;
  }

}