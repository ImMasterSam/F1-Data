import { useState } from "react";
import NavItem from "./NavItem";
import '../../CSS/SideNav.css'

import { AiFillHome } from "react-icons/ai";
import { BsBroadcast } from "react-icons/bs";
import { FaTrophy } from "react-icons/fa";
import { RiCalendarScheduleFill } from "react-icons/ri";

const NavItems = [
  { label: 'Home', href: '/', icon: <AiFillHome /> },
  { label: 'Live Timing', href: '/livetiming', icon: <BsBroadcast /> },
  { label: 'Standings', href: '/standings', icon: <FaTrophy /> },
  { label: 'Schedule', href: '/schedule', icon: <RiCalendarScheduleFill /> },
]

function SideNav() {

  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return <nav className='side-bar'>
    <button onClick={toggleExpanded}>{isExpanded ? 'Close' : 'Open'}</button>
    {NavItems.map((nav, index) => {
      return <NavItem navItem={nav} index={index} isExpanded={isExpanded}/>
    })}
  </nav>
}

export default SideNav