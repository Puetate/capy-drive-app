import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return <div className="flex h-full w-full items-center justify-center p-7">{children}</div>;
}
