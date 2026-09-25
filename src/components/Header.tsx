import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <h1>Recipe</h1>
        <span>from TheMealDB</span>
      </div>

      <nav className="nav">
        <NavLink to="/list" className={({ isActive }) => isActive ? 'navButton active' : 'navButton'}>
          List
        </NavLink>

        <NavLink to="/gallery" className={({ isActive }) => isActive ? 'navButton active' : 'navButton'}>
          Gallery
        </NavLink>
      </nav>
    </header>
  )
}

export default Header