import Navbar from "@/shared/components/navigation/Navbar"
import NavLink from "@/shared/components/navigation/NavLink"
import { ObjectId } from "mongoose"

export default async function JobLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ id: ObjectId }>
}>) {
  const { id } = await params

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Page content here */}
        <Navbar
          leading={
            <>
              <label
                htmlFor="my-drawer-2"
                className="btn btn-ghost drawer-button lg:hidden"
              >
                <i className="bx bx-menu-alt-left"></i>
              </label>
            </>
          }
        />
        <main className="px-2 lg:px-3">{children}</main>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul
          className="menu bg-base-200 text-base-content min-h-full w-80 p-4"
          id="drawer-menu"
        >
          {/* Sidebar content here */}
          <li>
            <NavLink to={`/job/${id}`}>Attendance</NavLink>
          </li>
          <li>
            <NavLink to={`/job/${id}/calculate`}>Calculate</NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}