export default function Footer() {
  return (
    <footer className="w-full bg-purple-800 mt-10 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-white text-sm">
        <div className="flex justify-center mb-3">
          <img
            src="/Unklab.png"
            alt="Logo Unklab"
            className="h-12 w-auto opacity-100"
          />
        </div>

        <p className="font-medium">Feedback System</p>
        <p className="mt-1">
          © {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
