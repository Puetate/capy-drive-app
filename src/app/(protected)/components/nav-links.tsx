"use client";
import NextNavLink from "@/components/next-nav-link";
import { cn } from "@/lib/utils/cn";
import {
  IconBuildingBank,
  IconBuildingSkyscraper,
  IconCardsFilled,
  IconFiles,
  IconFolder,
  IconSchool,
  IconShield,
  IconUsers,
  IconUsersGroup,
  TablerIconsProps
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppStore } from "../store/app.store";

type NavLink = {
  label: string;
  href: string;
  icon: (props: TablerIconsProps) => JSX.Element;
};

const superAdminLinks: NavLink[] = [
  { label: "Usuarios", href: "/admin/users", icon: IconUsers },
  { label: "Roles", href: "/admin/roles", icon: IconShield },
  { label: "Campus", href: "/admin/campus", icon: IconBuildingBank },
  { label: "Facultades", href: "/admin/faculties", icon: IconBuildingSkyscraper },
  { label: "Periodos Académicos", href: "/admin/periods", icon: IconSchool },
  { label: "Carreras", href: "/admin/careers", icon: IconCardsFilled }
];

const adminLinks: NavLink[] = [{ label: "Usuarios", href: "/admin/users", icon: IconUsers }];

const secretaryLinks: NavLink[] = [
  { label: "Plantillas/Carpetas", href: "/admin/templates", icon: IconFolder },
  { label: "Estudiantes", href: "/admin/students", icon: IconUsersGroup },
  { label: "Archivos", href: "/admin/files?type=student", icon: IconFiles }
];

const links: Record<string, NavLink[]> = {
  "SUPER-ADMIN": superAdminLinks,
  ADMIN: adminLinks,
  SECRETARY: secretaryLinks
};

export default function NavLinks({ onPathChange }: { onPathChange: (label: string) => void }) {
  const currentRole = useAppStore((state) => state.currentRole);
  const [currentLinks, setCurrentLinks] = useState<NavLink[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const link = currentLinks.find((link) => link.href === pathname);
    onPathChange(link?.label || "");
  }, [pathname, onPathChange, currentLinks]);

  useEffect(() => {
    if (currentRole === undefined) return;
    console.log(currentRole);

    setCurrentLinks(links[currentRole?.name as string]);
  }, [currentRole]);
  return (
    <>
      {currentLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <NextNavLink
            key={link.label}
            label={link.label}
            href={link.href}
            leftSection={<LinkIcon />}
            className={cn(
              "mt-2 rounded-lg font-bold text-black transition-colors duration-300 hover:bg-secondary-300",
              pathname === link.href && "bg-secondary-400"
            )}
          />
        );
      })}
    </>
  );
}
