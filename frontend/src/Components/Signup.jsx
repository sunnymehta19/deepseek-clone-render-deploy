import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DeepSeekLogo from "../../public/deepSeekLogo.svg";
import { useDispatch } from "react-redux";
import { registerUser } from "../Store/slices/authSlice";
import { toast } from "react-toastify";


const SignUp = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const handleSignup = async () => {
        setError("");

        if (!formData.username.trim()) {
            setError("Name is required");
            return;
        }

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
            await dispatch(registerUser(formData)).unwrap();
            toast.success("Signup successful! Please Login");
            navigate("/login");

        } catch (err) {
            setError(err || "Signup failed");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex items-center justify-center font-inter px-4">
            <div className=" text-white w-full max-w-[360px] rounded-2xl p-6">
                {/* Heading */}
                <h1 className="flex justify-center text-white text-2xl font-bold pb-3 items-center justify-center text-center">
                    <img src={DeepSeekLogo} className='h-7' alt="logo" />
                </h1>

                {/* firstName */}
                <div className="mb-4 mt-10">
                    <input
                        className="w-full bg-[#1B1B1C]  border border-gray-600 rounded-3xl px-5 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#4e6bf5]"
                        type="text"
                        name="username"
                        placeholder="Enter Name"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>


                {/* email */}
                <div className="mb-4 mt-2">
                    <input
                        className="w-full  bg-[#1B1B1C] border border-gray-600 rounded-3xl px-5 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#4e6bf5]"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                {/* password */}
                <div className="mb-4 mt-2 relative">
                    <input
                        className="w-full  bg-[#1B1B1C] border border-gray-600 rounded-3xl px-5 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-1 focus:ring-[#4e6bf5]"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <span
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-4 top-3.5 cursor-pointer"
                    >
                        {showPassword ? (
                            <EyeOff size={18} className="text-white" />
                        ) : (
                            <Eye size={18} className="text-white" />
                        )}
                    </span>

                </div>

                {/* Error Message */}
                {error && <span className="text-red-600 text-sm mb-4">{error}</span>}


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

                {/* Links */}
                <div className="flex justify-between mt-2 mb-2 text-sm">
                    <span className="text-white text-xs">
                        Haven't account?
                    </span>
                    <Link className="text-[#679AEF] hover:text-[#3964fe] text-xs" to={"/login"}>
                        Login
                    </Link>
                </div>

                {/* Signup button */}
                <button
                    onClick={handleSignup}
                    disabled={loading || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()}
                    className="w-full bg-[#5686FE] hover:bg-[#3964FE] text-white text-sm py-3 mt-1 cursor-pointer rounded-3xl transition disabled:opacity-50"
                >
                    {loading ? "Signing... " : "Signup"}
                </button>


            </div>
        </div>
    )
}

export default SignUp