"use client";

import { useState } from "react";
import api from "@/lib/axios";

import InputField from "@/components/admin/InputField";
import TextareaField from "@/components/admin/TextareaField";
import ImageUpload from "@/components/admin/ImageUpload";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";

interface Props {
  mode: "create" | "edit";
  initialData?: any;
}

export default function CarForm({ mode, initialData }: Props) {
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    category: initialData?.category || "",
    price: initialData?.price || "",
    fuel: initialData?.fuel || "",
    transmission: initialData?.transmission || "",
    seats: initialData?.seats || "",
    mileage: initialData?.mileage || "",
    year: initialData?.year || "",
    color: initialData?.color || "",
    description: initialData?.description || "",
    features: initialData?.features?.join(", ") || "",
    tags: initialData?.tags?.join(", ") || "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    initialData?.images?.[0] || null,
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Selected File:", file);

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (image) {
        formData.append("image", image);
      }

      formData.set(
        "features",
        JSON.stringify(
          form.features
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean),
        ),
      );

      formData.set(
        "tags",
        JSON.stringify(
          form.tags
            .split(",")
            .map((item: string) => item.trim())
            .filter(Boolean),
        ),
      );

      const token = localStorage.getItem("token");

      console.log("Image State:", image);

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      let response;

      if (mode === "create") {
        response = await api.post("/api/cars", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await api.put(`/api/cars/${initialData._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log(response.data);

      showToast(
        "success",
        mode === "create" ? "Car Added" : "Car Updated",
        mode === "create"
          ? "The new car has been added to your fleet."
          : "Car details have been updated successfully.",
      );

      router.push("/admin/cars");
    } catch (error: any) {
      console.log(error);

      showToast(
        "error",
        mode === "create" ? "Could Not Add Car" : "Could Not Update Car",
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {mode === "create" ? "Add New Car" : "Edit Car"}
        </h1>

        <p className="mt-2 text-slate-400">
          {mode === "create"
            ? "Fill all the required details."
            : "Update car details."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
        rounded-2xl
        border
        border-slate-700
        bg-[#101826]
        p-8
      "
      >
        <div className="grid min-w-0 gap-6 md:grid-cols-2">
          <InputField
            label="Car Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="BMW M4"
          />

          <InputField
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="BMW"
          />

          <InputField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Sports"
          />

          <InputField
            label="Price Per Day"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="12000"
          />
        </div>

        <div className="mt-6 grid min-w-0 gap-6 md:grid-cols-2">
          <ImageUpload preview={preview} onChange={handleImageChange} />

          <InputField
            label="Fuel Type"
            name="fuel"
            value={form.fuel}
            onChange={handleChange}
            placeholder="Petrol"
          />

          <InputField
            label="Transmission"
            name="transmission"
            value={form.transmission}
            onChange={handleChange}
            placeholder="Automatic"
          />

          <InputField
            label="Seats"
            name="seats"
            type="number"
            value={form.seats}
            onChange={handleChange}
            placeholder="4"
          />

          <InputField
            label="Mileage"
            name="mileage"
            value={form.mileage}
            onChange={handleChange}
            placeholder="15 km/l"
          />

          <div className="grid min-w-0 gap-6 md:grid-cols-2">
            <InputField
              label="Manufacturing Year"
              name="year"
              type="number"
              value={form.year}
              onChange={handleChange}
              placeholder="2024"
            />

            <InputField
              label="Color"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Black"
            />
          </div>
        </div>

        <div className="mt-6">
          <TextareaField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write a detailed description about the car..."
          />
        </div>

        <div className="mt-6">
          <TextareaField
            label="Features (comma separated)"
            name="features"
            rows={3}
            value={form.features}
            onChange={handleChange}
            placeholder="Sunroof, Leather Seats, Apple CarPlay"
          />
        </div>

        <div className="mt-6">
          <TextareaField
            label="Tags (comma separated)"
            name="tags"
            rows={2}
            value={form.tags}
            onChange={handleChange}
            placeholder="Luxury, Premium, Business"
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/cars")}
            className="
    rounded-xl
    border
    border-slate-700
    px-6
    py-3
    text-slate-300
    transition
    hover:bg-slate-800
    cursor-pointer
  "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
            rounded-xl
            bg-orange-500
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-orange-600
          "
          >
            Save Car
          </button>
        </div>
      </form>
    </div>
  );
}
