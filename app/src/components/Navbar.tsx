import React, {useState} from "react";
import { Link } from 'react-router-dom';
import "./navbar.scss";
import menu from "../assets/menu.svg";

interface NavbarProps {
  path: string;
  name: string;
}

const Navbar = ({navLinks, background, hoverBackground, linkColor} : {navLinks: NavbarProps[], background: string, hoverBackground: string, linkColor: string}) => {

  const [hoverIndex, setHoverIndex] = useState(-1);
  const [navOpen, setNavOpen] = useState(false);
  
  return (
    <nav className="navbar" style={{background}}>
      <ul 
        style={{background}}
        className={ navOpen ? 'active' : '' }
        >
        <figure onClick={ () => setNavOpen(!navOpen)} >
          <img src={menu} className="menu" />
        </figure>

        {navLinks.map((link, index) => {
          return (
            <li key={index}
              onMouseEnter={ () => setHoverIndex(index) }
              onMouseLeave={ () => setHoverIndex(-1) }
              style={{background: hoverIndex === index ? ( hoverBackground || "#999") : "" }}
            >
              <Link
                to={link.path}
                onClick={() => setNavOpen(!navOpen)}
                style={{ color: linkColor}}
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  );
}

export default Navbar;