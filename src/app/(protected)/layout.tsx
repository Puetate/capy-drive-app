"use client";

import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import AppLayout from "./components/app-layout";
import { useAppStore } from "./store/app.store";

export default function Layout({ children }: { children: ReactNode }) {
  const currentCareer = useAppStore((state) => state.currentCareer);
  const setCurrentCareer = useAppStore((state) => state.setCurrentCareer);
  const setCurrentRole = useAppStore((state) => state.setCurrentRole);
  const session = useSession();

  useEffect(() => {
    const career = session.data?.user.careers[0];
    const role = session.data?.user.currentRole;
    if (currentCareer === undefined) setCurrentCareer(career);
    setCurrentRole(role);
  }, [session.data]);

  return <AppLayout>{children}</AppLayout>;
}
