"use client";
import React from "react";
import { useParams } from "next/navigation";
import useClientStore from "@/store/useClientStore";
import { useEffect } from "react";
import Link from "next/link";
type Props = {};

export default function platDetailsPage({}: Props) {
  const params = useParams();
  const { id } = params as { id: string };
  const { getPlatById, plat } = useClientStore();
  const fetchData = async () => {
    await getPlatById(id);
  };
  useEffect(() => {
    fetchData();
  }, [id, getPlatById]);
  console.log("plat", plat);
  if (!plat) return <div>Loading...</div>;
  return <div>here the details of the plat</div>;
}
