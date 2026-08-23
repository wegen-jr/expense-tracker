import {useState, useEffect} from 'react';
import {User} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export default function Profile(){
    const API_URL = import.meta.env.VITE_API_URL;
    const token=localStorage.getItem('token');
    const [profile,setProfile]=useState({})
    const navigate=useNavigate();
    const [formData,setFormData]=useState({
        firstName:'',
        lastName:'',
        email:'',
        password:'',
        confirmPassword:''
    })
    const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const getProfile=async ()=>{
     try{
            const res=await fetch(`${API_URL}/api/user/profile`,{
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
const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !formData.firstName &&
    !formData.lastName &&
    !formData.email &&
    !formData.password
  ) {
    toast.error("Please insert at least one field");
    return;
  }

  if (
    formData.password &&
    formData.password !== formData.confirmPassword
  ) {
    toast.error("Password mismatch");
    return;
  }

  try {
    const updateData = {};

    if (formData.firstName.trim()) {
      updateData.firstName = formData.firstName.trim();
    }

    if (formData.lastName.trim()) {
      updateData.lastName = formData.lastName.trim();
    }

    if (formData.email.trim()) {
      updateData.email = formData.email.trim();
    }

    if (formData.password) {
      updateData.password = formData.password;
    }


    const res = await fetch(
      `${API_URL}/api/user/update`,
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

    if (data.success) {
      toast.success(data.message);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      getProfile();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to update");
  }
};
 const logout=()=>{
    localStorage.removeItem('token');
    toast.success('logout successfully')
    navigate('/');

 }
    useEffect(()=>{
        getProfile();
    },[]);
    return (
        <div className='py-10 px-5 bg-gray-800/10 min-h-dvh'>
            <div className="flex flex-col bg-green-700 rounded-2xl shadow-lg shadow-green-300 p-3  ">
                <div className='flex justify-center bg-white/10 rounded-2xl mb-2 p-2'>
                    <span className='font-serif font-bold text-2xl text-white text-center'>Profile page</span>
                </div>
                <div className=" p-5 bg-blue-900/90 rounded-full flex flex-col justify-center ">
                    <div className='flex items-center justify-center'>
                        <User className='w-15 h-15 rounded-full p-2 bg-white/10 '/>
                    </div>
                    <div className=' text-white font-serif font-semibold flex items-center justify-center m-2'>
                        <button
                            onClick={()=>logout()} 
                            className='p-2 bg-red-600 rounded-2xl w-32 hover:cursor-pointer'>
                            logout
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between gap-3 bg-white rounded-2xl p-3 my-2">
                {/* First + Last name */}
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-serif font-semibold px-2">
                        First name:
                    </span>

                    <span className="font-serif font-semibold px-3 py-1 bg-blue-800/10 rounded-2xl break-words">
                        {profile.firstName}
                    </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <span className="font-serif font-semibold px-2">
                        Last name:
                    </span>

                    <span className="font-serif font-semibold px-3 py-1 bg-blue-800/10 rounded-2xl break-words">
                        {profile.lastName}
                    </span>
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 md:max-w-[50%]">
                    <span className="font-serif font-semibold px-2 shrink-0">
                    Email:
                    </span>

                    <span className="font-serif font-semibold px-3 py-1 bg-blue-800/10 rounded-2xl break-all">
                    {profile.email}
                    </span>
                </div>
                </div>
                <div className='bg-white p-3 rounded-2xl '>
                    <div className='flex items-center justify-center'>
                         <span className='font-serif font-semibold capitalize px-2 py-1 bg-blue-800/10 rounded-2xl'>update ur profile</span>
                    </div>
                    <form 
                        onSubmit={handleSubmit}
                        className=' py-2 px-3 flex flex-col font-serif '
                    >
                    <div className='flex flex-col md:grid md:grid-cols-2 gap-3 xl:flex-row md:justify-between capitalize'>
                        <div className='flex flex-col font-semibold'>
                            <label >first name:</label>
                            <input 
                            type="text"
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange} 
                            className='bg-blue-800/10 p-2 rounded-2xl'
                        />
                        </div>
                        <div className='flex flex-col font-semibold'>
                            <label >last name:</label>
                            <input 
                            type="text" 
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            className='bg-blue-800/10 p-2 rounded-2xl'
                        />
                        </div>
                        <div className='flex flex-col font-semibold'>
                            <label >email:</label>
                            <input 
                            type="email" 
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            className='bg-blue-800/10 p-2 rounded-2xl'
                        />
                        </div>
                        <div className='flex flex-col font-semibold'>
                            <label >password:</label>
                            <input 
                            type="password" 
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='bg-blue-800/10 p-2 rounded-2xl'
                        />
                        </div>
                        <div className='flex flex-col font-semibold'>
                            <label >confirm password:</label>
                            <input 
                            type="password" 
                            name='confirmPassword'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className='bg-blue-800/10 p-2 rounded-2xl'
                        />
                        </div>
                        
                    </div>
                    <div className='flex items-center justify-center mt-2 bg-blue-800 font-bold font-serif text-white rounded-2xl p-2 capitalize hover:bg-blue-600'>
                        <button type='submit' className='hover:cursor-pointer'>
                            update
                        </button>
                    </div>
                   
                </form>
                </div>
                
            </div>
        </div>
    )}