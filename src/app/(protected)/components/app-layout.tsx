"use client";
import { AppShell, Burger, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";
import ConfigMenu from "./config-menu";
import NavLinks from "./nav-links";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [opened, { toggle }] = useDisclosure();
  const [title, setTitle] = useState("");

  const handleLinkChange = (title: string) => {
    setTitle(title);
  };

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="md"
      className="text-white"
    >
      <AppShell.Header className=" bg-primary-800">
        <Group h="100%" px="md" className="flex justify-between">
          <div>
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" color="white" />
            <Text className="hidden text-xl font-bold uppercase md:block">{title}</Text>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Text>{`${session?.user.currentRole.name} - ${session?.user.names} ${session?.user.surnames}`}</Text>
            <ConfigMenu />
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className=" bg-secondary-100">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="md"
            size="md"
            className="justify-self-start"
            color={opened ? "black" : "white"}
          />
          <img
            src="/logo-uta.webp"
            className="mx-auto h-[128px] w-[100px]"
            height="128px"
            width="100px"
            alt="logo uta"
          />
        </Group>
        <NavLinks onPathChange={handleLinkChange} />
      </AppShell.Navbar>
      <AppShell.Main className="flex bg-secondary-300">
        <div className="w-full">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
