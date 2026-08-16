"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import CarForm from "@/components/admin/CarForm";
import Spinner from "@/components/ui/Spinner";

export default function EditCarPage() {
  const { id } = useParams();

  const fetchCar = async () => {
    const res = await api.get(`/api/cars/${id}`);
    return res.data.car;
  };

  const { data: car, isLoading } = useQuery({
    queryKey: ["car", id],
    queryFn: fetchCar,
    enabled: !!id,
  });

  if (isLoading) {
    return <Spinner />;
  }

  return <CarForm mode="edit" initialData={car} />;
}