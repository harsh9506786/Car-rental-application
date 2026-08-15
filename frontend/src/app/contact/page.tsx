import ContactInfoCard from "@/components/contact/ContactInfo";
import ContactFormCard from "@/components/contact/ContactFormCard";
import { FaCarSide } from "react-icons/fa";

export default function ContactPage() {
  return (
    <section className="min-h-screen bg-[#030712] pt-38 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}

        <div className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-orange-500 md:text-6xl">
            Contact Our Team
          </h1>
          {/* Divider */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="h-[2px] w-20 bg-orange-400" />

            <FaCarSide className="text-orange-400" />

            <div className="h-[2px] w-20 bg-orange-400" />
          </div>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-400">
            Have questions about our premium fleet? Our team is ready to assist
            with your car rental needs.
          </p>
        </div>

        {/* Cards */}

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.4fr]">
          <ContactInfoCard />
          <ContactFormCard />
        </div>
      </div>
    </section>
  );
}
