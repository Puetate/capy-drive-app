import { NavLink, NavLinkProps } from "@mantine/core";
import Link, { LinkProps } from "next/link";

interface NextNavLinkProps extends NavLinkProps, LinkProps {}

export default function NextNavLink(props: NextNavLinkProps) {
  return <NavLink component={Link} {...props} />;
}
