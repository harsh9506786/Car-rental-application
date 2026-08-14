import Link from "next/link";
import { useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/context/ToastContext";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const handleSubscribe = async () => {
    try {
      const res = await api.post("/api/subscriber", {
        email,
      });

      showToast(res.data.type, res.data.title, res.data.message);

      if (res.data.type === "success") {
        setEmail("");
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.type || "error",
        err.response?.data?.title || "Error",
        err.response?.data?.message || "Something went wrong",
      );
    }
  };
  return (
    <footer className="relative overflow-hidden bg-[#030812]">
      {/* Top Premium Glow */}
      <div className="absolute inset-x-0 top-0 h-[4px] bg-orange-500/70" />

      <div
        className="
      absolute
      top-0
      left-0
      h-32
      w-full
      bg-gradient-to-b
      from-[#0b1730]
      via-[#08111f]
      to-transparent
      opacity-90
      pointer-events-none
    "
      />

      <div
        className="
      absolute
      top-0
      left-0
      h-px
      w-full
      bg-gradient-to-r
      from-transparent
      via-orange-500/80
      to-transparent
    "
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-6 pt-15">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1 */}
          <div>
            <h2 className="text-4xl font-bold text-white">
              DRIVE<span className="text-orange-400">GO</span>
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Premium car rental service with the latest models and exceptional
              customer service. Drive your dream car today!
            </p>

            <div className="mt-8 flex gap-4">
              {[
                FaFacebookF,
                FaTwitter,
                FaInstagram,
                FaLinkedinIn,
                FaYoutube,
              ].map((Icon, index) => (
                <div
                  key={index}
                  className="
                  flex
                  h-12
                  w-12
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  bg-slate-800
                  text-white
                  transition-all
                  duration-300
                  hover:bg-orange-500
                  "
                >
                  <Icon />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-3xl font-bold text-white">Quick Links</h3>

            <div className="mt-2 h-[3px] w-16 bg-orange-400" />

            <div className="mt-8 flex flex-col gap-5">
              <Link href="/" className="text-slate-400 hover:text-orange-400">
                Home
              </Link>

              <Link
                href="/cars"
                className="text-slate-400 hover:text-orange-400"
              >
                Cars
              </Link>

              <Link
                href="/contact"
                className="text-slate-400 hover:text-orange-400"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-3xl font-bold text-white">Contact Us</h3>

            <div className="mt-2 h-[3px] w-16 bg-orange-400" />

            <div className="mt-8 space-y-6 text-slate-400">
              <div className="flex gap-3">
                <FaMapMarkerAlt className="mt-1 text-orange-400" />
                <p>
                  123 Drive Avenue,
                  <br />
                  Auto City
                </p>
              </div>

              <div className="flex gap-3">
                <FaPhoneAlt className="text-orange-400" />
                <p>+91 7225037332</p>
              </div>

              <div className="flex gap-3">
                <FaEnvelope className="text-orange-400" />
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=info@drivego.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-400 transition"
                >
                  info@drivego.com
                </a>
              </div>
            </div>

            <div className="mt-10">
              <h4 className="text-xl font-semibold text-white">
                Business Hours
              </h4>

              <div className="mt-4 space-y-2 text-slate-400">
                <p>Mon - Fri : 8:00 AM - 8:00 PM</p>
                <p>Saturday : 9:00 AM - 6:00 PM</p>
                <p>Sunday : 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-3xl font-bold text-white">Newsletter</h3>

            <div className="mt-2 h-[3px] w-16 bg-orange-400" />

            <p className="mt-8 text-slate-400">
              Subscribe for special offers and updates
            </p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Your Email Address"
              className="
              mt-6
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-4
              py-4
              text-white
              outline-none
              "
            />

            <button
              onClick={handleSubscribe}
              className="
              mt-4
              w-full
              rounded-xl
              bg-orange-500
              py-4
              font-semibold
              cursor-pointer
              text-white
              transition-all
              duration-300
              hover:bg-orange-600
              "
            >
              Subscribe Now
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
          mt-10
          flex
          flex-col
          gap-4
          border-t
          border-slate-800
          pt-2
          text-slate-500
          md:flex-row
          md:justify-between
          "
        >
          <p>© 2026 DRIVEGO. All rights reserved.</p>

          <p>
            Designed by <span className="text-orange-400">DRIVEGO</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
