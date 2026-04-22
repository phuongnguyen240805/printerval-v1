import { PrimaryLayout } from "@/layouts";
import { ReactElement, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { api } from "@/utils/api";

const Signin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const loginMutation = api.medusa.loginUser.useMutation({
    onSuccess: (data) => {
      console.log("Login successful:", data);

      // Save login data to session/localStorage
      if (data) {
        sessionStorage.setItem('authToken', data as string);
        // Also save to localStorage if "Stay signed in" is checked
        if (staySignedIn) {
          localStorage.setItem('authToken', data as string);
        }
      }

      setLoading(false);

      // Redirect to home or dashboard
      window.location.href = '/';
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError(`Login failed: ${error.message}`);
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    console.log("Submitting:", { email, password });

    loginMutation.mutate({
      email,
      password,
    });
  };
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

        {/* Login Form */}
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8 lg:p-10">
          <h1 className="mb-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome to Printerval
          </h1>
          <p className="mb-6 text-center text-sm text-gray-600 sm:mb-8 sm:text-base">
            Complete all fields to log in
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-900">
                Your email address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your_email@domain.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                required
              />
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
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
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 py-3 font-bold text-white transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:py-3.5"
            >
              {loading ? "LOGGING IN..." : "LOG IN"}
            </button>

            {/* Stay Signed In & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-gray-700">Stay signed in</span>
              </label>
              <Link href="/forgot-password" className="text-gray-500 hover:text-gray-700 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">or login with</span>
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

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-orange-500 hover:text-orange-600 hover:underline">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Signin.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <PrimaryLayout
//       seo={{
//         title: 'Sign in',
//         description: 'Sign in',
//         canonical: 'https://karashop.vercel.app/signin',
//       }}
//     >
//       {page}
//     </PrimaryLayout>
//   );
// };

export default Signin;
// export default Signin;
