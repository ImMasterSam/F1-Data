import type { ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
  navItem: {
    label: string;
    href: string;
    icon: ReactElement;
  }
  index: number;
}


function NavItem({ navItem, index }: Props) {
  return <Link title={navItem.label} to={navItem.href} className='nav-item' key={index}>
    {navItem.icon}
    <h3>{navItem.label}</h3>
  </Link>
}

export default NavItem