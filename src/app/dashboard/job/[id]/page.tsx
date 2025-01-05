"use client"
import { IJob } from "@/models/jobs"
import {
  closeModal,
  DialogModal,
  openModal
} from "@/shared/components/actions/Modal"
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
import Swal from "sweetalert2"

export default function JobInformation() {
  const [loading, setLoading] = useState(false)
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
    setLoading(true)
    const { status, message } = await createAttendance({
      jobId: id,
      attendance: { date } as IAttendance
    })

    await fetchData()
    setLoading(false)
    closeModal("attendance")
    if (status) {
      Swal.fire({ title: "Successfully!", icon: "success", text: message })
    } else {
      Swal.fire({ title: "Error", text: message, icon: "error" })
    }
    return status
  }

  const attendanceCheck = async ({
    attendanceId,
    workerId,
    status
  }: {
    attendanceId: ObjectId
    workerId: ObjectId
    status: boolean
  }) => {
    await axios({
      method: "put",
      url: `/api/job/${id}/attendance/${attendanceId}`,
      data: {
        workerId,
        status
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
          <table className="table table-xs table-pin-rows table-pin-cols w-auto">
            {/* head */}
            <thead>
              <tr>
                <th className="sticky left-0 bg-base-300 z-10">
                  Worker/Date
                </th>
                {attendanceList.map((att, index) => (
                  <th key={index}>
                    {new Date(att.date).toLocaleDateString("th-TH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
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
                    <td className="sticky left-0 bg-base-300 z-10">{worker.name}</td>
                    {attendanceList.map((att: IAttendance, attIndex) => {
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
                              onChange={(e) =>
                                attendanceCheck({
                                  attendanceId: att._id,
                                  status: e.target.checked,
                                  workerId: worker._id
                                })
                              }
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
          selected={job.assignedWorkers?.map((w: IWorker) => w._id )}
        />
      </DialogModal>
      <DialogModal id={"attendance"} title={"Attendance"}>
        <AttendanceDateForm onSubmit={submitAttendance} />
      </DialogModal>
    </>
  )
}
