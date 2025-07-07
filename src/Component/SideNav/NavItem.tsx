import type { ReactElement } from "react";
import { Link } from "react-router-dom";

type Props = {
  navItem: {
    label: string;
    href: string;
    icon: ReactElement;
  }
  index: number;
  isExpanded: boolean
}


function NavItem({ navItem, index, isExpanded }: Props) {
  return <Link to={navItem.href} className='nav-item' key={index}>
    {navItem.icon}
    {isExpanded && <h3>{navItem.label}</h3>}
  </Link>
}

export default NavItem