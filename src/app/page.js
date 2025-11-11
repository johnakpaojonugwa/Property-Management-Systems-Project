"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function login () {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return null;
}