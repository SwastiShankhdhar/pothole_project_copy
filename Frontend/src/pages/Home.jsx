import { Link } from "react-router-dom";
import { ArrowRight, Shield, Eye, BarChart3 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../assets/pd.jpeg";

const features = [
  {
    icon: Eye,
    title: "Real-time Detection",
    description:
      "Potholes are detected and mapped in real time, giving you up-to-date road condition data.",
  },
  {
    icon: Shield,
    title: "Safer Commutes",
    description:
      "Plan routes using severity-coded maps to avoid damaged road stretches.",
  },
  {
    icon: BarChart3,
    title: "Data for Authorities",
    description:
      "Government bodies get insights to prioritize maintenance and repairs.",
  },
];

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col">

      <Header />

      {/* ================= HERO ================= */}
<section className="relative h-screen w-full overflow-hidden">

  {/* Background Image (light effect, NO overlay) */}
  <img
    src={heroImage}
    alt="road"
    className="absolute inset-0 h-full w-full object-cover brightness-25 contrast-5"
  />

  {/* Content */}
  <div className="relative z-10 flex h-full items-center px-8 md:px-20">
    <div className="max-w-2xl">

      <span className="mb-5 inline-block rounded-full bg-green-600 px-4 py-1 text-xs font-semibold text-white">
        Pothole Detection System
      </span>

      <h1 className="mb-6 text-5xl font-bold text-black md:text-6xl">
        Making Roads Safer,
        <br />
        One Pothole at a Time
      </h1>

      <p className="mb-8 text-lg text-gray-800">
        Report, track, and visualize road conditions in your city.
        Help authorities fix roads faster with real-time pothole data.
      </p>

      <div className="flex gap-4">
        <Link to="/signup">
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition">
            Get Started →
          </button>
        </Link>

        <Link to="/login">
          <button className="rounded-lg border border-gray-400 px-6 py-3 hover:bg-gray-100 transition">
            Sign In
          </button>
        </Link>
      </div>

    </div>
  </div>
</section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">

          <h2 className="mb-3 text-3xl font-bold text-black">
            How It Works
          </h2>

          <p className="mb-12 text-gray-600">
            A simple three-step process to keep your city's roads in check.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Icon className="text-blue-600" size={22} />
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SEVERITY ================= */}
      <section className="border-t bg-white py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">

          <h2 className="mb-8 text-3xl font-bold text-black">
            Severity Color Coding
          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <span className="mt-1 h-4 w-4 rounded-full bg-red-500" />
              <div className="text-left">
                <p className="font-semibold">High Risk</p>
                <p className="text-xs text-gray-600">
                  Unsafe — many potholes detected
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <span className="mt-1 h-4 w-4 rounded-full bg-yellow-500" />
              <div className="text-left">
                <p className="font-semibold">Moderate</p>
                <p className="text-xs text-gray-600">
                  Some potholes — drive with caution
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border p-4">
              <span className="mt-1 h-4 w-4 rounded-full bg-green-500" />
              <div className="text-left">
                <p className="font-semibold">Safe</p>
                <p className="text-xs text-gray-600">
                  Good condition — no potholes
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};

export default Home;