import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/Unklab.png"
            alt="Logo Unklab"
            className="h-12 w-auto opacity-80"
          />
          <span className="font-semibold text-lg">Feedback System</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
