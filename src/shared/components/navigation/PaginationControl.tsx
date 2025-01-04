import { IPagination } from "@/shared/repository/services";
import React from "react";



interface PaginationControlProps {
  pagination: IPagination;
  setPagination: React.Dispatch<React.SetStateAction<IPagination>>;
}

const PaginationControl: React.FC<PaginationControlProps> = ({ pagination, setPagination }) => {
  const { page, totalPages } = pagination;

  const handlePrevious = () => {
    if (page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

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
  );
};

export default PaginationControl;
