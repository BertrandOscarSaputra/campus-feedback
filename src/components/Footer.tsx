export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 mt-10 py-6">
      <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
        <div className="flex justify-center mb-3">
          <img
            src="/Unklab.png"
            alt="Logo Unklab"
            className="h-12 w-auto opacity-80"
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
