import { IJob } from "@/models/jobs"
import { IPagination } from "@/shared/repository/services"

export default function JobTable({
  data,
  loading,
  pagination,
  onInfo
}: {
  data: IJob[]
  loading: boolean
  pagination: IPagination
  onInfo: (job: IJob) => void
}) {
  const { page, limit } = pagination
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Job</th>
              <th>Description</th>
              <th>Action</th>
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
                    {data.map((job:IJob, index) => (
                      <tr key={index}>
                        <th>{limit * (page - 1) + index + 1}</th>
                        <td>
                          <a href={`/job/${job._id}`}>{job.title}</a>
                        </td>
                        <td>{job.description}</td>
                        <td>
                          <button
                            className="btn btn-sm"
                            onClick={() => onInfo(job)}
                          >
                            <i className="bx bx-dots-vertical"></i>
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
