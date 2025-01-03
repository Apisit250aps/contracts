import { auth } from "@/auth";
import { ReactNode } from "react"

export default async function Navbar({ leading }: { leading?: ReactNode }) {
  const session = await auth()
  return (
    <>
      <div className="navbar bg-base-100">
        {leading ? <div className="navbar-start lg:hidden">{leading}</div> : null}
        <div className="navbar-center lg:navbar-start">
          <a className="btn btn-ghost text-xl">Hello `{session?.user.name}</a>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <i className="bx bx-dots-vertical-rounded"></i>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href="/api/auth/signout">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
