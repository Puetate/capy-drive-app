"use client";
import { Menu } from "@mantine/core";
import { IconLogout2, IconSettingsFilled } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ConfigMenu() {
  const router = useRouter();

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
          <Menu.Item leftSection={<IconLogout2 />} onClick={async () => await handleSignOut()}>
            Cerrar Sesión
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
