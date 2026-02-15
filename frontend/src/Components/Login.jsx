import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from '../Store/slices/authSlice';
import DeepSeekLogo from "../../public/deepSeekLogo.svg";
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleLogin = async () => {
        setError("");

        if (!formData.email.trim()) {
            setError("Email is required");
            return;
        }

        if (!formData.password.trim()) {
            setError("Password is required");
            return;
        }

        setLoading(true);

        try {
            await dispatch(
                loginUser({
                    email: formData.email,
                    password: formData.password,
                })
            ).unwrap();

            toast.success("Login successfull");
            navigate("/");
        } catch (err) {
            console.log("Error received:", err);

            setError(err || "Login failed");
        }
        finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex font-inter items-center justify-center bg-[#151517] px-4 ">
            <div className=" text-white w-full max-w-[360px] rounded-2xl p-6 mb-14">
                {/* Heading */}
                <h1 className="flex justify-center text-white  text-2xl font-bold pb-3 items-center justify-center text-center">
                    <img src={DeepSeekLogo} className='h-7' alt="logo" />
                </h1>

                {/* email */}
                <div className="mb-4 mt-10">
                    <input

                        className="w-full bg-[#1B1B1C] border border-gray-600 rounded-3xl px-5 py-3 font-inter placeholder:font-inter placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#4e6bf5]"
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* password */}
                <div className="mb-4 mt-2 relative">
                    <input

                        className="w-full bg-[#1B1B1C] border  border-gray-600 rounded-3xl px-5 py-3 font-inter placeholder:font-inter placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#4e6bf5]"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span
                        onClick={() => setShowPassword(prev => !prev)}
                        className=" absolute right-4 top-3.5 text-gray-400 cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff size={18} className="text-white" />
                        ) : (
                            <Eye size={18} className="text-white" />
                        )}
                    </span>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm mt-2 mb-4">
                        {error}
                    </div>
                )}


                {/* Terms & Condition */}
                <div className="flex flex-col  text-gray-400 mt-4 mb-8">
                    <div className=" text-xs whitespace-nowrap mb-0.5 ">
                        By signing up or logging in, you consent to DeepSeek's
                    </div>
                    <div className="text-xs">
                        <a className="underline-offset-2 text-white underline" target="_blank" href="https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html?locale=en_US">
                            Terms of Use
                        </a>{" "}
                        and{" "}
                        <a className="underline-offset-2 text-white underline" target="_blank" href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html?locale=en_US">
                            Privacy Policy
                        </a>

                    </div>
                </div>

                <div className="flex justify-between mt-4 mb-2 text-sm">
                    <span className="text-white text-xs">
                        Haven't account?
                    </span>
                    <Link className="text-[#679AEF] hover:text-[#3964fe] text-xs" to={"/signup"}>
                        Signup
                    </Link>
                </div>

                {/* Login button */}
                <button
                    onClick={handleLogin}
                    disabled={loading || !formData.email.trim() || !formData.password.trim()}
                    className=" w-full bg-[#5686FE] hover:bg-[#3964FE] text-white text-sm py-3 cursor-pointer rounded-3xl transition disabled:opacity-50"
                >
                    {loading ? "logging in... " : "Log in"}
                </button>


            </div>
        </div>
    )
}

export default Login