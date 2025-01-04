import { ReactNode } from "react"

export function openModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.showModal()
}

export function closeModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement
  modal.close()
}

export function DialogModal({
  id,
  title,
  children
}: {
  id: string
  title: string
  children?: ReactNode
}) {
  return (
    <>
      <dialog id={id} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{title}</h3>
          {children}
        </div>
      </dialog>
    </>
  )
}
