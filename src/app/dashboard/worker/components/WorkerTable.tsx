import { IWorker } from "@/models/workers"
import { IPagination } from "@/shared/repository/services"

export default function WorkerTable({
  data,
  loading,
  pagination
}: {
  data: IWorker[]
  loading: boolean
  pagination: IPagination
}) {
  const { page, limit } = pagination
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <span className="loading loading-dots loading-sm"></span>
                </td>
              </tr>
            ) : (
              <>
                {!data.length ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  <>
                    {data.map((worker, index) => (
                      <tr key={index}>
                        <th>{limit * (page - 1) + index + 1}</th>
                        <td>{worker.name}</td>
                        <td>{worker.contact}</td>
                        <td>
                          <button className="btn btn-sm">
                            <i className="bx bx-dots-vertical-rounded"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
