import { useRouter } from "next/navigation";

export function useBookNow(carId: string) {
  const router = useRouter();

  const handleBookNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push(`/login?redirect=/cars/${carId}`);
      return;
    }

    router.push(`/cars/${carId}`);
  };

  return handleBookNow;
}