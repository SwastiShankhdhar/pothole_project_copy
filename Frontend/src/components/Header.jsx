import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <MapPin className="text-blue-600" />
          RoadWatch
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          
          <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;