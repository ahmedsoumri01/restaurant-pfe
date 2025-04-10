"use client";
import React from "react";
import { useParams } from "next/navigation";
import useClientStore from "@/store/useClientStore";
import { useEffect } from "react";
import Link from "next/link";
type Props = {};

export default function getAllPlatOfCategorie({}: Props) {
  const { getAllDisponiblePlatsOfCategorie, plats, isLoading } =
    useClientStore();
  const params = useParams();
  const { id } = params as { id: string };
  const fetchData = async () => {
    await getAllDisponiblePlatsOfCategorie(id);
  };
  useEffect(() => {
    fetchData();
  }, [getAllDisponiblePlatsOfCategorie, id]);

  console.log(plats);
  return (
    <div>
      page {id}
      {plats.map((plat) => (
        <Link
          href={`/client/plats/${plat._id}`}
          key={plat._id}
          className="cursor-pointer"
        >
          <div className="p-4 border rounded-lg shadow-md">
            <h2 className="mt-2 text-lg font-semibold">{plat.nom}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
