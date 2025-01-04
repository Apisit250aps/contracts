import { ReactNode } from "react"

export function CardData({
  title,
  actions,
  children
}: {
  title: string
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title flex justify-between">
          <h2>{title}</h2>
          <div className="card-actions">{actions}</div>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  )
}
