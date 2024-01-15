"use client";
import NextNavLink from "@/components/next-nav-link";
import { cn } from "@/lib/utils/cn";
import { IconCardsFilled, IconFolder, IconSchool, IconShield, IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

 const links = [
  { label: "Usuarios", href: "/admin/users", icon: IconUsers },
  { label: "Roles", href: "/admin/roles", icon: IconShield },
  { label: "Plantillas/Carpetas", href: "/admin/templates", icon: IconFolder },
  { label: "Periodos Académicos", href: "/admin/periods", icon: IconSchool },
  { label: "Estudiantes", href: "/admin/students", icon: IconUsersGroup },
  { label: "Carreras", href: "/admin/careers", icon: IconCardsFilled },
];

export default function NavLinks({ onPathChange }: { onPathChange: (label: string) => void }) {
  const pathname = usePathname();
  useEffect(() => {
    const link = links.find((link) => link.href === pathname);
    onPathChange(link?.label || "");
  }, [pathname, onPathChange]);
  return (
    <>
      {links.map((link) => {
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
