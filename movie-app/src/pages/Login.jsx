import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, googleProvider } from "../config/firebase";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Login and Register
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      dispatch(setUser(result.user));
      toast.success(`Welcome, ${result.user.displayName}!`);
    } catch (error) {
      toast.error("Google login failed.");
    }
  };

  const onSubmit = async (data) => {
    try {
      let result;
      if (isSignUp) {
        // REGISTER NEW USER
        result = await createUserWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Account created successfully!");
      } else {
        // LOGIN EXISTING USER
        result = await signInWithEmailAndPassword(auth, data.email, data.password);
        toast.success("Welcome back!");
      }
      dispatch(setUser(result.user));
    } catch (error) {
      toast.error(isSignUp ? "Registration failed. Email might be taken." : "Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-black/80 p-10 rounded-lg shadow-2xl border border-slate-800">
        <h2 className="text-3xl font-bold text-white mb-8">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-slate-800 text-white border-b-2 border-transparent focus:border-red-600 outline-none transition-all"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              {...register("password", { 
                required: "Password is required", 
                minLength: { value: 6, message: "Min 6 characters" } 
              })}
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-slate-800 text-white border-b-2 border-transparent focus:border-red-600 outline-none transition-all"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="text-slate-400 mt-4 text-sm">
          {isSignUp ? "Already have an account?" : "New to Movie App?"}{" "}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-white font-bold cursor-pointer hover:underline"
          >
            {isSignUp ? "Sign In now." : "Sign up now."}
          </span>
        </p>

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-slate-700" />
          <span className="px-2 text-slate-500 text-sm italic">OR</span>
          <hr className="w-full border-slate-700" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full mt-6 flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded hover:bg-slate-200 transition-colors"
        >
          <FcGoogle size={24} /> Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;