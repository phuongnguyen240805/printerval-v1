import { PrimaryLayout } from "@/layouts";
import { ReactElement, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/utils/api";

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  general?: string;
};

const Signup = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerMutation = api.medusa.registerUser.useMutation({
    onSuccess: (data) => {
      setLoading(false);
      setSuccess(true);

      // Redirect after showing success message
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    },
    onError: (error) => {
      console.error("Registration error:", error);
      setErrors({ general: `Registration failed: ${error.message}` });
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    console.log("Submitting:", { firstName, lastName, email, password });

    registerMutation.mutate({
      firstName,
      lastName,
      email,
      password,
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8 lg:p-10 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">Your account has been created successfully. Redirecting to sign in...</p>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Banners */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <div className="relative h-24 w-full overflow-hidden rounded-2xl shadow-md sm:h-28 sm:w-64">
            <Image
              src="/assets/reward-purchase-new.png"
              alt="Rewards on every purchase"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-24 w-full overflow-hidden rounded-2xl shadow-md sm:h-28 sm:w-64">
            <Image
              src="/assets/free-return.png"
              alt="Free return"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8 lg:p-10">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Create Your Account
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600 sm:mb-8 sm:text-base">
            Complete all fields to sign up
          </p>

          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* First Name Input */}
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-semibold text-gray-900">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (errors.firstName) {
                    setErrors(prev => ({ ...prev, firstName: "" }));
                  }
                }}
                placeholder="John"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                required
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>

            {/* Last Name Input */}
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-gray-900">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (errors.lastName) {
                    setErrors(prev => ({ ...prev, lastName: "" }));
                  }
                }}
                placeholder="Doe"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                required
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                Your email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: "" }));
                  }
                }}
                placeholder="your_email@domain.com"
                className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors(prev => ({ ...prev, password: "" }));
                    }
                  }}
                  placeholder="Enter your password (min 6 characters)"
                  className={`w-full rounded-lg border px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:py-3.5"
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or sign up with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <FaFacebookF className="text-blue-600" size={18} />
              <span className="text-sm sm:text-base">Facebook</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <FaGoogle className="text-red-500" size={18} />
              <span className="text-sm sm:text-base">Google</span>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Signup.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <PrimaryLayout
//       seo={{
//         title: 'Sign Up',
//         description: 'Create your account',
//         canonical: 'https://karashop.vercel.app/signup',
//       }}
//     >
//       {page}
//     </PrimaryLayout>
//   );
// };

export default Signup;
