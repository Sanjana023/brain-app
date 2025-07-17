import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleSignup } from '../api/auth';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Form submitted:', formData); // Debug

  const res = await handleSignup(formData);
  console.log('Response from handleSignup:', res); // Debug

  if (res.success) {
    toast.success('Signup successful!');
    setTimeout(() => navigate('/signin'), 2000);
  } else {
    if (typeof res.message === 'string') {
      toast.error(res.message);
    } else {
      try {
        const formatted = res.message.format();
        const messages = Object.values(formatted)
          .map((field: any) => field?._errors?.[0])
          .filter(Boolean);

        if (messages.length > 0) {
          messages.forEach((msg) => toast.error(msg));
        } else {
          toast.error('Invalid input');
        }
      } catch (err) {
        toast.error('Something went wrong.');
      }
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100 relative overflow-hidden">
      {/* Background Emojis */}
      <div className="absolute text-[120px] opacity-10 select-none pointer-events-none">
        🧠📘✨
      </div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10 space-y-6">
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <User className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Mail className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Lock className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <div
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
