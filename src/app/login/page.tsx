"use client";
import { Card } from "@mantine/core";
import LoginButton from "./components/login-button";

export default function LoginPage() {
  return (
    <Card className="rounded-xl bg-secondary-400 p-10 shadow-2xl shadow-slate-400">
      <h1 className="mb-3 text-center text-2xl font-extrabold text-white">CAPY DRIVE</h1>
      <h2 className="text-center text-xl font-bold text-white">Sistema de gestión de documentos</h2>
      <Card.Section className="my-4 flex justify-center p-4">
        <img
          src="logo-uta.webp"
          className="h-[167px] w-[130px]"
          height="167px"
          width="130px"
          alt="logo uta"
        />
      </Card.Section>

      <LoginButton />
    </Card>
  );
}
