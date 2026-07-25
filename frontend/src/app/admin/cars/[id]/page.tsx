"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

import CarForm from "@/components/admin/CarForm";

export default function EditCarPage() {
  const { id } = useParams();

  const [car, setCar] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCar();
  }, []);

  const fetchCar = async () => {
    try {
      const res = await api.get(
        `/api/cars/${id}`
      );

      setCar(res.data.car);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white">
        Loading...
      </div>
    );
  }

  return (
    <CarForm
      mode="edit"
      initialData={car}
    />
  );
}