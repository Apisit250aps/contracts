import { IPagination } from "@/shared/repository/services"
import React from "react"

interface PaginationControlProps {
  pagination: IPagination
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>
}

export const LimitControl: React.FC<
  PaginationControlProps & { range?: number[] }
> = ({ pagination, setPagination, range = [10, 25, 50, 75, 100] }) => {
  return (
    <>
      <div className="dropdown dropdown-hover">
        <div tabIndex={0} role="button" className="btn m-1">
          Limit {pagination.limit}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {range.map((limit) => (
            <li
              key={limit}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  limit: limit,
                  page: 1
                }))
              }
            >
              <a>{limit}</a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const PaginationControl: React.FC<PaginationControlProps> = ({
  pagination,
  setPagination
}) => {
  const { page, totalPages } = pagination

  const handlePrevious = () => {
    if (page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
    }
  }

  const handleNext = () => {
    if (page < totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
    }
  }

  return (
    <div className="join">
      <button
        className="join-item btn"
        onClick={handlePrevious}
        disabled={page <= 1}
      >
        «
      </button>
      <span className="join-item btn">Page {page}</span>
      <button
        className="join-item btn"
        onClick={handleNext}
        disabled={page >= totalPages}
      >
        »
      </button>
    </div>
  )
}

export default PaginationControl
