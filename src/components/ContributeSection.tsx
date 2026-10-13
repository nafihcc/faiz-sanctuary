import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartHandshake,
  MapPinPlus,
  BookOpenCheck,
  Code2,
  Share2,
  Check,
  Copy,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  Send,
  QrCode,
  Smartphone,
  X,
} from "lucide-react";

type ContributionType = "masjid" | "sunnah" | "sadaqah" | "code";

const UPI_ID = "nafihcc1234-2@okcici";
const UPI_PAYEE_NAME = "Mohammed Nafih C C";
const UPI_URI = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_PAYEE_NAME)}&tn=${encodeURIComponent("Shareek Sadaqah Jariyah Support")}&cu=INR`;
const UPI_QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=12&color=0a261e&bgcolor=faf8f5&data=${encodeURIComponent(UPI_URI)}`;

export function ContributeSection() {
  const [copiedShare, setCopiedShare] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeModal, setActiveModal] = useState<ContributionType | null>(null);
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formDetails, setFormDetails] = useState("");

  const handleCopyShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabels: Record<ContributionType, string> = {
      masjid: "Masjid Submission / Verification",
      sunnah: "Adhkar & Translation Review",
      sadaqah: "Sadaqah Jariyah & Project Support",
      code: "Open-Source Code Contribution",
    };
    const label = activeModal ? typeLabels[activeModal] : "Community Contribution";
    const text = [
      `Assalamu Alaikum! I would like to contribute to *Shareek (شريك)* (${label}):`,
      formName ? `• Name / Title: ${formName}` : "",
      formLocation ? `• City / Coordinates: ${formLocation}` : "",
      formDetails ? `• Details: ${formDetails}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/919048291729?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    setActiveModal(null);
    setFormName("");
    setFormLocation("");
    setFormDetails("");
  };

  return (
    <section
      id="contribute"
      className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-12"
    >
      <div className="relative rounded-[2rem] overflow-hidden border border-[#c5a059]/30 bg-gradient-to-br from-[#0a261e] via-[#0f382c] to-[#155e42] text-[#faf8f5] shadow-2xl">
        {/* Subtle Islamic geometric lattice background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #d4af37 1px, transparent 0)`,
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 p-7 sm:p-10 lg:p-12">
          {/* Top header row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#e6c875] text-xs font-mono uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sadaqah Jariyah · صَدَقَة جَارِيَة</span>
              </div>

              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white leading-[1.1]">
                Contribute to Shareek{" "}
                <span className="font-arabic text-[#e6c875] font-normal">(شَرِيك)</span>
              </h2>

              <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
                “When a person dies, their deeds come to an end except for three: ongoing charity{" "}
                <span className="text-[#e6c875] font-medium">(Sadaqah Jariyah)</span>, beneficial
                knowledge, or a righteous child who prays for them.”{" "}
                <span className="text-white/50 font-mono text-xs">— Sahih Muslim 1631</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleCopyShare}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs sm:text-sm font-semibold text-white transition cursor-pointer"
              >
                {copiedShare ? (
                  <>
                    <Check className="w-4 h-4 text-[#e6c875]" />
                    <span>Link Copied — Share with Family</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#e6c875]" />
                    <span>Share Shareek</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModal("sadaqah")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0a261e] text-xs sm:text-sm font-semibold shadow-lg shadow-[#c5a059]/20 hover:brightness-105 transition cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Support via UPI</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Contribution Cards */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Sadaqah Jariyah UPI Support */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-gradient-to-b from-[#d4af37]/[0.14] to-white/[0.05] border border-[#d4af37]/40 transition flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37]/25 border border-[#d4af37]/40 grid place-items-center text-[#e6c875]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#d4af37]/20 text-[#e6c875] border border-[#d4af37]/30">
                    UPI · Sadaqah
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-white">
                  Support as Sadaqah Jariyah
                </h3>
                <p className="mt-1.5 text-xs text-white/75 leading-relaxed">
                  Help keep Shareek 100% ad-free and openly accessible. Support server & audio
                  hosting directly via UPI:
                </p>

                {/* Inline Copyable UPI Badge */}
                <div className="mt-3 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-black/25 border border-white/15">
                  <span className="text-xs font-mono text-[#e6c875] truncate select-all">
                    {UPI_ID}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-white/80 hover:text-[#e6c875] transition shrink-0 cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveModal("sadaqah")}
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0a261e] text-xs font-semibold shadow-md hover:brightness-105 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Scan QR / Pay via UPI</span>
              </button>
            </motion.div>

            {/* 2. Submit Masjid */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-[#d4af37]/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/30 grid place-items-center text-[#e6c875]">
                  <MapPinPlus className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-white">
                  Add a Local Masjid
                </h3>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Help worshippers find nearby mosques by submitting verified GPS coordinates,
                  Jumu&apos;ah timings, and prayer facilities in your locality.
                </p>
              </div>
              <button
                onClick={() => setActiveModal("masjid")}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#d4af37] hover:text-[#0a261e] text-xs font-semibold text-[#e6c875] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Submit Masjid Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* 3. Verify Adhkar & Translations */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-[#d4af37]/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/30 grid place-items-center text-emerald-300">
                  <BookOpenCheck className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-white">
                  Adhkar & Knowledge
                </h3>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Suggest authentic Duas from Hisn al-Muslim, review Arabic diacritics, or
                  contribute local translations (Malayalam, Urdu, Tamil, Arabic).
                </p>
              </div>
              <button
                onClick={() => setActiveModal("sunnah")}
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#d4af37] hover:text-[#0a261e] text-xs font-semibold text-[#e6c875] transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Suggest or Review Text</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* 4. Open Source Code */}
            <motion.div
              whileHover={{ y: -4 }}
              className="rounded-2xl p-5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-[#d4af37]/40 transition flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-400/20 border border-teal-400/30 grid place-items-center text-teal-300">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold text-white">
                  Open-Source Code
                </h3>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Developers and designers can contribute features, astronomical calculation
                  refinements, and offline PWA enhancements on GitHub.
                </p>
              </div>
              <a
                href="https://github.com/nafihcc/faiz-sanctuary"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-[#d4af37] hover:text-[#0a261e] text-xs font-semibold text-[#e6c875] transition flex items-center justify-center gap-1.5"
              >
                <span>Contribute on GitHub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Contribution Modal */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-surface border border-[#c5a059]/40 p-6 sm:p-8 shadow-2xl text-deep"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c5a059] font-semibold">
                    {activeModal === "sadaqah" ? "Sadaqah Jariyah · صَدَقَة جَارِيَة" : "Community Contribution"}
                  </span>
                  <h3 className="mt-1 text-2xl font-display font-semibold text-deep">
                    {activeModal === "masjid" && "Submit or Verify a Masjid"}
                    {activeModal === "sunnah" && "Suggest Adhkar or Correction"}
                    {activeModal === "sadaqah" && "Support Shareek via UPI"}
                    {activeModal === "code" && "Join as a Contributor"}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 rounded-full hover:bg-mist text-deep/60 hover:text-deep transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {activeModal === "sadaqah" ? (
                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl bg-panel border border-hairline p-5 flex flex-col items-center text-center">
                    <div className="p-3 rounded-2xl bg-white border border-[#c5a059]/30 shadow-md">
                      <img
                        src={UPI_QR_URL}
                        alt={`UPI QR Code for ${UPI_ID}`}
                        className="w-44 h-44 rounded-lg object-contain"
                      />
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-deep/50">
                      Scan with Google Pay, PhonePe, Paytm or any UPI App
                    </p>
                    <p className="mt-1 text-sm font-semibold text-deep font-display">
                      {UPI_PAYEE_NAME}
                    </p>

                    <div className="mt-4 w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-mist/70 border border-hairline">
                      <div className="text-left">
                        <span className="block text-[10px] uppercase tracking-wider text-deep/50 font-mono">
                          UPI ID
                        </span>
                        <span className="text-sm font-mono font-semibold text-deep select-all">
                          {UPI_ID}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0c3b2e] to-[#155e42] text-[#e6c875] text-xs font-semibold shadow-sm hover:brightness-110 transition cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy UPI ID</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href={UPI_URI}
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0a261e] text-xs font-semibold shadow-md hover:brightness-105 transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open UPI App Directly</span>
                    </a>
                    <a
                      href="https://wa.me/919048291729?text=Assalamu%20Alaikum%2C%20I%20contributed%20to%20Shareek%20via%20UPI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-hairline bg-panel hover:bg-mist text-deep text-xs font-semibold transition"
                    >
                      <MessageCircle className="w-4 h-4 text-[#155e42]" />
                      <span>Message on WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWhatsAppSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-deep/70 mb-1.5">
                      {activeModal === "masjid"
                        ? "Masjid Name"
                        : activeModal === "sunnah"
                        ? "Your Name & Reference Source"
                        : "Your Name (Optional)"}
                    </label>
                    <input
                      type="text"
                      required={activeModal === "masjid"}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder={
                        activeModal === "masjid"
                          ? "e.g., Mishkal Masjid, Kuttichira"
                          : "Enter name or Hadith reference..."
                      }
                      className="w-full rounded-xl bg-panel border border-hairline px-3.5 py-2.5 text-sm text-deep focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-deep/70 mb-1.5">
                      {activeModal === "masjid"
                        ? "City / Google Maps Link / Coordinates"
                        : activeModal === "sunnah"
                        ? "Category (e.g., Masjid, Morning/Evening, Translation)"
                        : "Contribution Area"}
                    </label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder={
                        activeModal === "masjid"
                          ? "e.g., Kozhikode, Kerala or Google Maps URL"
                          : "e.g., Malayalam translation / Hadith verification"
                      }
                      className="w-full rounded-xl bg-panel border border-hairline px-3.5 py-2.5 text-sm text-deep focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-deep/70 mb-1.5">
                      {activeModal === "masjid"
                        ? "Jumu'ah Time & Facilities (Wudu, Women's space, Parking)"
                        : "Details / Message"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={formDetails}
                      onChange={(e) => setFormDetails(e.target.value)}
                      placeholder={
                        activeModal === "masjid"
                          ? "e.g., Jumu'ah Khutbah at 12:30 PM, ample parking..."
                          : "Share the details of your contribution..."
                      }
                      className="w-full rounded-xl bg-panel border border-hairline px-3.5 py-2.5 text-sm text-deep focus:outline-none focus:border-[#c5a059]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2.5 rounded-xl border border-hairline text-xs font-semibold text-deep/70 hover:bg-mist transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0c3b2e] to-[#155e42] text-[#e6c875] text-xs font-semibold shadow-md hover:brightness-110 transition cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Contribution via WhatsApp</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
