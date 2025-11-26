export default function Footer() {
  return (
    <footer className="bg-purple-800 text-white pt-10 pb-6 mt-10">
      {/* Top horizontal line */}
      <div className="border-t border-white mx-8"></div>

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8">
          {/* Logo & Title */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <img
              src="/Unklab.png"
              alt="Logo Unklab"
              className="h-14 w-auto opacity-100"
            />
            <p className="font-semibold text-lg">Feedback System</p>
            <p className="text-sm leading-relaxed text-center md:text-left">
              Sistem saran dan masukan Unklab.
            </p>
          </div>

          {/* Contacts */}
          <div className="flex flex-col space-y-3 text-center md:text-left">
            <h3 className="font-bold text-lg mb-1">Contacts</h3>
            <p className="flex items-center justify-center md:justify-start gap-2">
              📞 +62 853 0943 7394
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
              ✉️ unklab@unklab.ac.id
            </p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="font-bold text-lg mb-1">Location</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.597345140158!2d124.98139947355307!3d1.4175081613575993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32870a95df6309dd%3A0x21d86e4847556add!2sUniversitas%20Klabat!5e0!3m2!1sen!2sid!4v1756085704976!5m2!1sen!2sid"
              width="240"
              height="140"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-xl"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Bottom horizontal line */}
      <div className="border-t border-white mx-8 mt-4"></div>

      <p className="text-center text-sm mt-3 font-semibold">
        © {new Date().getFullYear()} All Rights Reserved · Feedback System
        UNKLAB
      </p>
    </footer>
  );
}
