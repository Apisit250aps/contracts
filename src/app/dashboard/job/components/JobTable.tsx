import { IJob } from "@/models/jobs"

export default function JobTable({
  data,
  loading
}: {
  data: IJob[]
  loading: boolean
}) {
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
                    {data.map((job, index) => (
                      <tr key={index}>
                        <th>{index + 1}</th>
                        <td>
                          <a href={`/dashboard/job/${job._id}`}>{job.title}</a>
                        </td>
                        <td>{job.description}</td>
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
