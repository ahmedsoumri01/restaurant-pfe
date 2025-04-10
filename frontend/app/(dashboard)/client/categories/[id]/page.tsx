"use client";
import React from "react";
import { useParams } from "next/navigation";
import useClientStore from "@/store/useClientStore";
import { useEffect } from "react";
type Props = {};

export default function page({}: Props) {
  const { getAllDisponiblePlatsOfCategorie, plats } = useClientStore();
  const params = useParams();
  const { id } = params as { id: string };
  const fetchData = async () => {
    await getAllDisponiblePlatsOfCategorie(id);
  };
  useEffect(() => {
    fetchData();
  }, [getAllDisponiblePlatsOfCategorie, id]);

  console.log(plats);
  return <div>page {id}</div>;
}
