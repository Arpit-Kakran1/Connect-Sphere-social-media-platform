import axios from 'axios'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { setAuthUser } from '@/redux/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'

const SignUp = () => {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }
  const { user } = useSelector(store => store.auth);
  const signupHandler = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
        headers: {
          "Content-Type": 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        navigate("/")
        setInput({
          email: "",
          password: ""
        })
      }

    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (user) navigate("/")
  }, [])
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
      <form action="" onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 w-100'>

        <div className="my-4">
          <h1 className='text-center font-bold text-xl mb-1'>Logo</h1>
          <p className='text-sm text-center'>Login</p>
        </div>
        <div className='flex flex-col gap-6'>
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              onChange={handleInputChange}
              value={input.email}
              placeholder="Email"
            >
            </Input>
          </div>

          <div className="flex flex-col gap-1">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              onChange={handleInputChange}
              value={input.password}
              placeholder="Password"
            >
            </Input>
          </div>
          {
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                Please Wait😒
              </Button>
            ) : (
              <Button type="submit">Login</Button>
            )
          }

          <span className='text-center'>Didn't have account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
        </div>
      </form>
    </div>
  )
}

export default SignUp
