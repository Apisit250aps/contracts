"use client"

import { IJob } from "@/models/jobs"
import { DialogModal, openModal } from "@/shared/components/actions/Modal"
import { CardData } from "@/shared/components/display/cards"
import axios from "axios"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import JobWorkerSelect from "../components/JobWorkerSelect"
import { IWorker } from "@/models/workers"

export default function JobInformation() {
  const { id } = useParams()
  const [job, setJob] = useState<IJob & { assignedWorkers: IWorker[] }>(
    {} as IJob & { assignedWorkers: IWorker[] }
  )

  const setAddWorker = () => {
    openModal("workers")
  }

  const fetchData = useCallback(async () => {
    const data = await axios(`/api/job/${id}`)
    console.log(data.data.job)
    setJob(data.data.job)
  }, [])

  const assignWorker = async (workers: IWorker[]) => {
    const workersId = workers.map((w) => w._id)
    await axios({
      method: "post",
      url: `/api/job/${id}`,
      data: {
        workers: workersId
      }
    })
    await fetchData()
  }

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <>
      <CardData
        title={job.title as string}
        actions={
          <>
            <button className="btn" onClick={setAddWorker}>
              <i className="bx bx-user-plus"></i>
            </button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Workers</th>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {job.assignedWorkers ? (
                <>
                  {job.assignedWorkers.map((worker: IWorker, index: number) => (
                    <tr key={index}>
                      <td>{worker.name}n</td>
                      <th></th>
                      <td>Quality Control Specialist</td>
                      <td>Blue</td>
                    </tr>
                  ))}
                </>
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
      </CardData>
      <DialogModal id={"workers"} title={"Workers"}>
        <JobWorkerSelect
          onExport={assignWorker}
          selected={job.assignedWorkers?.map((w: IWorker) => w._id)}
        />
      </DialogModal>
    </>
  )
}
