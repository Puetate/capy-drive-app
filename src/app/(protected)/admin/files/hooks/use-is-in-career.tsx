import { useAppStore } from "@/app/(protected)/store/app.store";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useIsInCareer() {
  const session = useSession();
  const currentCareer = useAppStore((state) => state.currentCareer);
  const [isInCareers, setIsInCareers] = useState(true);

  useEffect(() => {
    const isInCareers = session.data?.user.careers.some((career) => career.id === currentCareer?.id);
    setIsInCareers(isInCareers ?? false);
  }, [currentCareer]);

  return isInCareers;
}
