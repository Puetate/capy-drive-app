import { Career } from "@/app/models/career.model";
import { Role } from "@/app/models/role.model";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppStore {
  currentCareer: Career | undefined;
  setCurrentCareer: (currentCareer: Career | undefined) => void;
  currentRole: Role | undefined;
  setCurrentRole: (currentRole: Role | undefined) => void;
}

export const useAppStore = create(
  persist<AppStore>(
    (set) => ({
      currentCareer: undefined,
      setCurrentCareer: (currentCareer) => set(() => ({ currentCareer })),
      currentRole: undefined,
      setCurrentRole: (currentRole) => set(() => ({ currentRole }))
    }),
    {
      name: "app"
    }
  )
);
