"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FaWhatsapp } from "react-icons/fa";
import { useToast } from "@/context/ToastContext";
import CustomSelect from "@/components/ui/CustomSelect";

export default function ContactFormCard() {
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    carType: "",
    message: "",
  });

  const [carOptions, setCarOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await api.get("/api/cars");
      const options = res.data.cars.map((car: any) => ({
        value: car.name,
        label: car.name,
      }));
      setCarOptions(options);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCarTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, carType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/contact", form);

      showToast("success", res.data.title, res.data.message);

      window.open(res.data.whatsappUrl, "_blank");

      setForm({
        name: "",
        email: "",
        phone: "",
        carType: "",
        message: "",
      });
    } catch (error: any) {
      showToast(
        error.response?.data?.type || "error",
        error.response?.data?.title || "Error",
        error.response?.data?.message || "Something went wrong.",
      );
    }
  };

  return (
    <div className="rounded-3xl border border-gray-800 bg-[#0B1120] p-8 shadow-lg">
      <h2 className="text-3xl font-bold text-white">Send us a Message</h2>

      <p className="mt-3 text-gray-400">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full rounded-xl border border-gray-700 bg-[#111827] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
          />
        </div>

        {/* Email + Phone */}
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-xl border border-gray-700 bg-[#111827] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter your phone"
              className="w-full rounded-xl border border-gray-700 bg-[#111827] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Car */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Car Type
          </label>

          <CustomSelect
            value={form.carType}
            onChange={handleCarTypeChange}
            options={carOptions}
            placeholder="Select a Car"
          />
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Message
          </label>

          <textarea
            rows={6}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your rental requirements..."
            className="w-full resize-none rounded-xl border border-gray-700 bg-[#111827] px-5 py-4 text-white outline-none transition placeholder:text-gray-500 focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 cursor-pointer rounded-xl bg-[#EA6A11] py-4 text-lg font-semibold text-white transition hover:bg-[#D95E09] hover:shadow-[0_8px_20px_rgba(234,106,17,0.25)]"
        >
          <span>Send Message</span>
          <FaWhatsapp className="text-lg" />
        </button>
      </form>
    </div>
  );
}
