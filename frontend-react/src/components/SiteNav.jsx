import { NavLink } from "react-router-dom";
import "./SiteNav.css";

function navClass({ isActive }) {
  return isActive ? "active" : undefined;
}

export default function SiteNav() {
  return (
    <nav className="navbar">
      <NavLink className="brand" to="/">
        JL Zoo
      </NavLink>
      <div className="links">
        <NavLink to="/" className={navClass} end>
          Home
        </NavLink>
        <NavLink to="/about" className={navClass}>
          About
        </NavLink>
        <NavLink to="/contact" className={navClass}>
          Contact
        </NavLink>
      </div>
    </nav>
  );
}
