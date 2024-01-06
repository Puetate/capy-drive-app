"use client";

import { Button } from "@mantine/core";
import { IconBrandOffice } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    await signIn("azure-ad", { redirect: true });
  };

  return (
    <Button
      className="rounded-lg bg-orange-500 transition-colors duration-300 hover:bg-orange-600"
      onClick={handleLogin}
      loading={loading}
      leftSection={<IconBrandOffice />}
    >
      Ingresar con Microsoft Office 365
    </Button>
  );
}
