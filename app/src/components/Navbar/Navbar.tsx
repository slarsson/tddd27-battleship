import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.scss";
import menu from "../../assets/menu.svg";

interface NavbarProps {
  path: string;
  name: string;
}

export const Navbar = ({ navLinks }: { navLinks: NavbarProps[] }) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <nav className="navbar">
      <ul className={navOpen ? "active" : ""}>
        <div className="menu">
          <figure onClick={() => setNavOpen(!navOpen)}>
            <img src={menu} className="menu-icon" />
          </figure>
        </div>

        {navLinks.map((link, index) => {
          return (
            <Link
              key={index}
              to={link.path}
              onClick={() => setNavOpen(!navOpen)}
            >
              {link.name}
            </Link>
          );
        })}
      </ul>
    </nav>
  );
};
