import Navbar from "@/shared/components/navigation/Navbar"

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
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
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <a>Dashboard</a>
          </li>
          <li>
            <a>Workers</a>
          </li>
        </ul>
      </div>
    </div>
  )
}
