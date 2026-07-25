import Hero from "@/components/home/Hero";
import CarCollection from "@/components/home/CarCollection";
import Testimonials from "@/components/home/TestimonialsData";
import StatsCTA from "@/components/home/StatsCTA";

export default function Home() {
  return (
    <>
      <main className="min-h-screen">
        <Hero />
        <CarCollection />
        <Testimonials />
        <StatsCTA />
      </main>
    </>
  );
}
