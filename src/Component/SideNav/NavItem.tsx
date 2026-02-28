import { useEffect, useState, type ReactElement } from "react";
import { FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

type Props = {
  label: string;
  href: string;
  icon: ReactElement;
  children?: Props[];
  index: number;
  openSideNav?: Function;
  isSideNavExpanded?: boolean
}


function NavItem({ label, href, icon, children, index, openSideNav, isSideNavExpanded }: Props) {

  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const hasChildren = children && children.length > 0

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (openSideNav)
        openSideNav();
  }

  useEffect(() => {
    if (!isSideNavExpanded) {
      setIsExpanded(false);
    }
  })

  if (hasChildren) {
    return (
      <div className="nav-item-container">
        <div className="nav-item parent" onClick={toggleExpand}>
          {icon}
          <h3>{label}</h3>
          <span className={`arrow-icon ${isExpanded ? "" : "down"}`}>
            <FaChevronUp />
          </span>
        </div>
        
        {/* 子選單區域 */}
        <div className={`sub-menu ${isExpanded ? 'expanded' : ''}`}>
          {children.map((child, index) => (
            <NavItem 
              key={index}
              index={index}
              label={child.label}
              icon={child.icon}
              href={child.href}
              // 這裡不傳遞 children，除非你需要多層巢狀
            />
          ))}
        </div>
      </div>
    )
  }

  return <Link title={label} to={href} className='nav-item' key={index}>
    {icon}
    <h3>{label}</h3>
  </Link>
}

export default NavItem