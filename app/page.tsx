"use client";
import { HeroSection } from "@/components/hero-section";
import { account } from "@/lib/appwrite";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function getUser() {
      const user = await account.get();
      console.log({ user });
    }
    getUser();
  }, []);

  return (
    <main>
      <HeroSection />
    </main>
  );
}
