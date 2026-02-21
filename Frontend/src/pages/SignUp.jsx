import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Header from "../components/Header";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
import InputOTP from "../components/ui/InputOTP";

const SignUp = () => {
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
    if (otp.length === 6) navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm border rounded-lg p-6 shadow">

          <div className="text-center mb-6">
            <MapPin className="mx-auto mb-3 text-blue-600" size={28} />
            <h2 className="text-2xl font-bold">Create Account</h2>
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Label>Email Address</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" className="w-full">
                Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <InputOTP value={otp} onChange={setOtp} />
              <Button type="submit" className="w-full">
                Verify & Create Account
              </Button>
            </form>
          )}

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default SignUp;