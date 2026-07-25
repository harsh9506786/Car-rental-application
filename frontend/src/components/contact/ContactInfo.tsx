import { MapPin, Mail, Clock3, BadgePercent } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function ContactinfoCard() {
  return (
    <div className="rounded-3xl border border-gray-800 bg-[#0B1120] p-8 shadow-lg">
      {/* Heading */}
      <div className="flex items-center gap-3">
        <MapPin className="h-6 w-6 text-orange-500" />

        <h2 className="text-3xl font-bold text-white">Our Information</h2>
      </div>
      <p className="mt-3 text-gray-400 leading-7">
        Reach out to us through any of the following channels. We're here to
        help make your rental experience smooth.
      </p>

      {/* Info Cards */}
      <div className="mt-10 space-y-5">
        {/* WhatsApp */}
        <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-orange-500">
          <div className="rounded-xl bg-[#1A2233] p-3">
            <FaWhatsapp className="text-[#25D366]" size={22} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">WhatsApp</h3>

            <p className="mt-1 text-lg text-gray-400">+91 7225037332</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-orange-500">
          <div className="rounded-xl bg-[#3A2A22] p-3">
            <Mail className="text-orange-500" size={22} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">Email</h3>

            <p className="mt-1 break-all text-lg text-gray-400">
              contact@karzone.com
            </p>
          </div>
        </div>

        {/* Hours */}
        <div className="flex items-start gap-4 rounded-2xl border border-gray-800 bg-[#111827] p-5 transition hover:border-orange-500">
          <div className="rounded-xl bg-[#3A2A22] p-3">
            <Clock3 className="text-orange-500" size={22} />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white">Hours</h3>

            <p className="mt-1 text-lg text-gray-400">Mon-Sat: 8AM-8PM</p>

            <p className="text-lg text-gray-500">Sunday: 10AM-6PM</p>
          </div>
        </div>
      </div>

      {/* Offer Card */}
    
      <div className="mt-10 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-[#3A2A22] p-2">
            <BadgePercent className="text-orange-500" size={20} />
          </div>

          <h3 className="text-xl font-bold text-white">Special Offer!</h3>
        </div>

        <p className="mt-3 text-lg text-gray-300">
          Book for 3+ days and get 10% discount
        </p>
      </div>
    </div>
  );
}
