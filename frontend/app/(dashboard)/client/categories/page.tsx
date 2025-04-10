"use client";
import React, { useEffect } from "react";
import useClientStore from "@/store/useClientStore";
type Props = {};
import Link from "next/link";
export default function getAllCategories({}: Props) {
  const { getAllCategories, categories } = useClientStore();
  useEffect(() => {
    const fetchData = async () => {
      await getAllCategories();
    };
    fetchData();
  }, [getAllCategories]);
  console.log(categories);
  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {categories.map((category) => (
          <Link
            href={`/client/categories/${category._id}`}
            key={category._id}
            className="cursor-pointer"
          >
            <div key={category._id} className="p-4 border rounded-lg shadow-md">
              <h2 className="mt-2 text-lg font-semibold">{category.nom}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
