"use client";
import { Menu } from "@mantine/core";
import { IconLogout2, IconSettingsFilled } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAppStore } from "../store/app.store";
import {defaultRoutes} from "@/app/models/route.model";

export default function ConfigMenu() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const currentRole = useAppStore((state) => state.currentRole);
  const setCurrentRole = useAppStore((state) => state.setCurrentRole);

  const handleSignOut = async () => {
    const { url } = await signOut({ callbackUrl: "/login", redirect: false });
    window.history.replaceState(null, "", "/");
    router.push(url);
  };

  return (
    <div>
      <Menu withArrow>
        <Menu.Target>
          <IconSettingsFilled className="hover:cursor-pointer" />
        </Menu.Target>
        <Menu.Dropdown>
          {session?.user &&
            session?.user.roles.length > 1 &&
            session?.user?.roles.map(
              (role) =>
                currentRole?.name !== role.name && (
                  <Menu.Item
                    key={role.id}
                    onClick={async () => {
                      await update({ ...session, user: { ...session.user, currentRole: role } });
                      setCurrentRole(role);
                      router.push(defaultRoutes[role.name]);
                    }}
                  >
                    Cambiar a {role.name}
                  </Menu.Item>
                )
            )}
          <Menu.Item leftSection={<IconLogout2 />} onClick={async () => await handleSignOut()}>
            Cerrar Sesión
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
