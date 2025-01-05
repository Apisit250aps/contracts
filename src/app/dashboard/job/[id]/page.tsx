"use client"

import { IJob } from "@/models/jobs"
import { DialogModal, openModal } from "@/shared/components/actions/Modal"
import { CardData } from "@/shared/components/display/cards"
import axios from "axios"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import JobWorkerSelect from "../components/JobWorkerSelect"
import { IWorker } from "@/models/workers"
import { createAttendance, getAttendance, getJob } from "@/services/jobServices"
import { IAttendance } from "@/models/attendances"
import AttendanceDateForm from "../components/AttendanceDateForm"
import { ObjectId } from "mongoose"

export default function JobInformation() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<IJob & { assignedWorkers: IWorker[] }>(
    {} as IJob & { assignedWorkers: IWorker[] }
  )
  const [attendanceList, setAttendance] = useState<IAttendance[]>([])

  const setAddWorker = () => {
    openModal("workers")
  }

  const fetchData = useCallback(async () => {
    const [job, attendances] = await Promise.all([
      getJob(id),
      getAttendance(id)
    ])
    setAttendance(attendances.data!)
    setJob(job.data!)
  }, [])

  const assignWorker = async (workers: IWorker[]) => {
    const workersId = workers.map((w: IWorker) => w._id)
    await axios({
      method: "post",
      url: `/api/job/${id}/assign`,
      data: {
        workers: workersId
      }
    })
    await fetchData()
  }

  const submitAttendance = async (date: Date) => {
    await createAttendance({ jobId: id, attendance: { date } as IAttendance })
    await fetchData()
    return true
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
          <table className="table w-auto">
            {/* head */}
            <thead>
              <tr>
                <th>Workers</th>
                {attendanceList.map((att, index) => (
                  <th key={index}>
                    {new Date(att.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit"
                    })}
                  </th>
                ))}
                <th>
                  <button
                    className="btn"
                    onClick={() => openModal("attendance")}
                  >
                    <i className="bx bx-calendar-plus"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {job.assignedWorkers?.map(
                (worker: IWorker, workerIndex: number) => (
                  <tr key={workerIndex}>
                    <td>{worker.name}</td>
                    {attendanceList.map((att, attIndex) => {
                      const record = att.records.find(
                        (rec: { worker: ObjectId; status: boolean }) =>
                          rec.worker.toString() === worker._id.toString()
                      )
                      return (
                        <td key={attIndex} className="text-center">
                          {record ? (
                            <input
                              type="checkbox"
                              className="checkbox"
                              defaultChecked={record.status}
                            />
                          ) : (
                            <i className="bx bxs-x-square bx-md text-red-500"></i>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                )
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
      <DialogModal id={"attendance"} title={"Attendance"}>
        <AttendanceDateForm onSubmit={submitAttendance} />
      </DialogModal>
    </>
  )
}
