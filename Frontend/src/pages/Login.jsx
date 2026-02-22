
// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { MapPin } from "lucide-react";
// import Header from "../components/Header";
// import Button from "../components/ui/Button";
// import Input from "../components/ui/Input";
// import Label from "../components/ui/Label";
// import InputOTP from "../components/ui/InputOTP";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otp, setOtp] = useState("");
//   const navigate = useNavigate();

//   const handleSendOtp = (e) => {
//     e.preventDefault();
//     if (email) setOtpSent(true);
//   };

//   const handleVerifyOtp = (e) => {
//     e.preventDefault();
//     if (otp.length === 6) navigate("/dashboard");
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">

//       {/* <Header /> */}

//       {/* Full Screen Center */}
//       <main className="flex flex-1 items-center justify-center px-6 py-12">

//         <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-10">

//           {/* Title */}
//           <div className="text-center mb-10">
//             <MapPin className="mx-auto mb-4 text-gray-800" size={36} />
//             <h2 className="text-3xl font-bold text-gray-900">
//               Login to RoadWatch
//             </h2>
//             <p className="text-sm text-gray-600 mt-2">
//               Access your dashboard securely
//             </p>
//           </div>

//           {/* Form */}
//           {!otpSent ? (
//             <form onSubmit={handleSendOtp} className="space-y-6">

//               <div>
//                 <Label>Email Address</Label>
//                 <Input
//                   type="email"
//                   placeholder="Enter email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="mt-2"
//                 />
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
//               >
//                 Send OTP
//               </Button>

//             </form>
//           ) : (
//             <form onSubmit={handleVerifyOtp} className="space-y-6">

//               <p className="text-sm text-center text-gray-600">
//                 Enter OTP sent to{" "}
//                 <span className="font-medium text-gray-900">{email}</span>
//               </p>

//               <InputOTP value={otp} onChange={setOtp} />

//               <Button
//                 type="submit"
//                 disabled={otp.length < 6}
//                 className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 disabled:opacity-50"
//               >
//                 Verify & Login
//               </Button>

//               {/* <button
//                 type="button"
//                 onClick={() => setOtpSent(false)}
//                 className="text-sm text-gray-600 hover:text-gray-900 underline w-full"
//               >
//                 Change Email
//               </button> */}

//             </form>
//           )}

//           {/* Signup Link */}
//           <p className="text-center text-sm mt-10 text-gray-600">
//             Don’t have an account?{" "}
//             <Link
//               to="/signup"
//               className="font-medium text-gray-900 hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>

//         </div>

//       </main>
//     </div>
//   );
// };

// export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import InputOTP from "../components/ui/InputOTP";

const Login = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) setOtpSent(true);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    // 🔥 ANY 4 DIGIT OTP WORKS
    if (otp.length === 4) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex flex-1 items-center justify-center px-6 py-12">

        <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-10">

          {/* Title */}
          <div className="text-center mb-10">
            <MapPin className="mx-auto mb-4 text-gray-800" size={36} />
            <h2 className="text-3xl font-bold text-gray-900">
              Login to RoadWatch
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Access your dashboard securely
            </p>
          </div>

          {/* Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-6">

              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
              >
                Send OTP
              </Button>

            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">

              <p className="text-sm text-center text-gray-600">
                Enter 4-digit OTP sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>
              </p>

              <InputOTP value={otp} onChange={setOtp} />

              <Button
                type="submit"
                disabled={otp.length < 4}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 disabled:opacity-50"
              >
                Verify & Login
              </Button>

            </form>
          )}

          <p className="text-center text-sm mt-10 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-gray-900 hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>

      </main>
    </div>
  );
};

export default Login;