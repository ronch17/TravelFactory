import { NavLink, Outlet } from 'react-router-dom'

const linkBaseClasses =
  'rounded-md px-4 py-2 text-sm font-medium transition-colors'

const activeLinkClasses = 'bg-indigo-600 text-white'
const inactiveLinkClasses = 'bg-white text-gray-600 hover:bg-gray-100'

export function AppNavigation() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Vacation Management Interface
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            TravelFactory recruitment assignment
          </p>
          <nav className="mt-4 flex flex-wrap gap-3">
            <NavLink
              to="/requester"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              Requester Interface
            </NavLink>
            <NavLink
              to="/validator"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              Validator Interface
            </NavLink>
          </nav>
        </header>
        <Outlet />
      </div>
    </main>
  )
}

