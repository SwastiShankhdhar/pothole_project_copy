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
    <div className="flex min-h-screen flex-col bg-white">

      <Header />

      {/* ================= HERO ================= */}
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background Image */}
        <img
          src={heroImage}
          alt="road"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Smooth Whitish Bright Overlay (No Line Effect) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/50"></div>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center px-8 md:px-20">
          <div className="max-w-2xl">

            <span className="mb-5 inline-block rounded-md bg-gray-800 px-4 py-1.5 text-xs font-semibold text-white tracking-wide">
              Pothole Detection System
            </span>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl leading-tight">
              Making Roads Safer,
              <br />
              One Pothole at a Time
            </h1>

            <p className="mb-8 text-lg text-gray-700">
              Report, track, and visualize road conditions in your city.
              Help authorities fix roads faster with real-time pothole data.
            </p>

            <div className="flex gap-4">
              <Link to="/signup">
                <button className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800 transition">
                  Get Started <ArrowRight size={18} />
                </button>
              </Link>

              {/* <Link to="/login">
                <button className="rounded-md border border-gray-400 px-6 py-3 text-white-800 hover:bg-gray-100 transition">
                  Sign In
                </button>
              </Link> */}
              {/* <Link to="/login">
  <button className="rounded-md bg-gray-800 border border-gray-600 px-6 py-3 text-white hover:bg-gray-700 transition">
    Sign In
  </button>
</Link> */}
            </div>

          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      {/* <section className="bg-gray-50 py-20 px-6">
        <div className="mx-auto max-w-6xl text-center">

          <h2 className="mb-3 text-3xl font-bold text-gray-900">
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
                  className="rounded-lg border bg-white p-8 shadow-sm hover:shadow-md transition"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-md bg-gray-100 p-3">
                      <Icon className="text-gray-800" size={22} />
                    </div>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
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
      </section> */}
      <section className="bg-gray-50 py-20 px-6">
  <div className="mx-auto max-w-6xl text-center">

    <h2 className="mb-3 text-3xl font-bold text-gray-900">
      Why We Built This
    </h2>

    <p className="mb-12 text-gray-600 max-w-3xl mx-auto">
      Road safety is a major concern in many cities. Potholes not only damage vehicles
      but also cause accidents and delays. We built this system to help detect,
       and visualize road damage in real time so that authorities can
      prioritize repairs efficiently and improve infrastructure quality.
    </p>

    <div className="grid gap-8 md:grid-cols-3 text-left">

      <div className="rounded-lg border bg-white p-8 shadow-sm hover:shadow-md transition">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Improve Road Safety
        </h3>
        <p className="text-sm text-gray-600">
          Help drivers avoid risky roads by providing clear and updated
          pothole information.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-8 shadow-sm hover:shadow-md transition">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Support Authorities
        </h3>
        <p className="text-sm text-gray-600">
          Provide structured data to help government teams
          plan maintenance more effectively.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-8 shadow-sm hover:shadow-md transition">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          Smart Monitoring
        </h3>
        <p className="text-sm text-gray-600">
          Use technology to detect and track road conditions
          in a modern and scalable way.
        </p>
      </div>

    </div>
  </div>
</section>

      {/* ================= SEVERITY ================= */}
<section className="bg-gray-50 py-20 px-6">
  <div className="mx-auto max-w-5xl text-center">

    <h2 className="mb-4 text-3xl font-bold text-gray-900">
      Severity Color Coding
    </h2>

    <p className="mb-12 text-gray-600 max-w-2xl mx-auto">
      Road conditions are categorized based on pothole intensity
      to help users and authorities understand risk levels easily.
    </p>

    <div className="grid gap-8 md:grid-cols-3">

      {/* High Risk */}
      <div className="rounded-xl bg-white p-8 shadow-sm border hover:shadow-md transition">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
            <span className="h-5 w-5 rounded-full bg-red-500"></span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          High Risk
        </h3>
        <p className="text-sm text-gray-600">
          Unsafe road conditions with multiple potholes detected.
        </p>
      </div>

      {/* Moderate */}
      <div className="rounded-xl bg-white p-8 shadow-sm border hover:shadow-md transition">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100">
            <span className="h-5 w-5 rounded-full bg-yellow-500"></span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Moderate
        </h3>
        <p className="text-sm text-gray-600">
          Some potholes present. Drive carefully in these areas.
        </p>
      </div>

      {/* Safe */}
      <div className="rounded-xl bg-white p-8 shadow-sm border hover:shadow-md transition">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <span className="h-5 w-5 rounded-full bg-green-500"></span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Safe
        </h3>
        <p className="text-sm text-gray-600">
          Road is in good condition with no pothole detection.
        </p>
      </div>

    </div>
  </div>
</section>
      <Footer />

    </div>
  );
};

export default Home;