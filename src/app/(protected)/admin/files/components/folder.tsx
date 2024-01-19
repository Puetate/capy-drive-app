import { cn } from "@/lib/utils/cn";
import { Text } from "@mantine/core";
import Link from "next/link";
import { ReactNode } from "react";

interface FolderCompoundComponentProps {
  className?: string;
  children?: ReactNode;
}

const FolderText = ({ children, className }: FolderCompoundComponentProps) => {
  return (
    <Text className={cn("font-semibold", className)} component="span">
      {children}
    </Text>
  );
};

interface FolderProps {
  href: string;
  children?: ReactNode;
  onClick?: () => void;
}

export default function Folder({ href, children, onClick }: FolderProps) {
  return (
    <Link
      className="flex gap-4 rounded-lg p-3 transition-colors duration-300 hover:bg-secondary-300 hover:underline"
      onClick={onClick}
      href={href}
    >
      {children}
    </Link>
  );
}

Folder.Text = FolderText;
