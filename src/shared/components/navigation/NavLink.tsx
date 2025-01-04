"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function NavLink({
  to,
  children,
  activeClassName = "active"
}: {
  to: string
  children: ReactNode
  activeClassName?: string
}) {
  const pathname = usePathname()
  const isActive = pathname === to
  return (
    <Link href={to} legacyBehavior>
      <a className={isActive ? activeClassName : ""}>{children}</a>
    </Link>
  )
}
