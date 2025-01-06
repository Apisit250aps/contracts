"use client"
import { CardData } from "@/shared/components/display/cards"
import JobTable from "./components/JobTable"
import {
  closeModal,
  DialogModal,
  openModal
} from "@/shared/components/actions/Modal"
import { useCallback, useEffect, useState } from "react"
import { IJob } from "@/models/jobs"
import { IPagination } from "@/shared/repository/services"
import {
  createJob,
  deleteJob,
  fetchAllJob,
  updatedJob
} from "@/services/jobServices"
import PaginationControl, {
  LimitControl
} from "@/shared/components/navigation/PaginationControl"
import JobForm from "./components/JobForm"
import Swal from "sweetalert2"

export default function DashboardJob() {
  const [loading, setLoading] = useState<boolean>(false)
  const [jobData, setJobData] = useState<IJob[]>([])
  const [job, setJob] = useState<IJob>({
    title: "",
    description: ""
  } as IJob)
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const setCreate = () => {
    setJob({
      title: "",
      description: ""
    } as IJob)
    openModal("job-modal")
  }

  const setEdit = (job: IJob) => {
    setJob(job as IJob)
    openModal("job-modal")
  }

  const handleDelete = async (jobId: string) => {
    try {
      closeModal("job-modal")
      const result = await Swal.fire({
        title: "Are you sure you want to delete this Job?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it"
      })

      if (result.isConfirmed) {
        setLoading(true)
        const { status, message } = await deleteJob(jobId)

        if (status) {
          await Swal.fire({ title: "Deleted!", icon: "success", text: message })
        } else {
          await Swal.fire({ title: "Error", text: message, icon: "error" })
        }

        return status
      }
      return false // Action canceled
    } catch (error) {
      console.error(error)
      await Swal.fire({
        title: "Error",
        text: "Something went wrong.",
        icon: "error"
      })
      return false
    } finally {
      await fetchData()
      setLoading(false)
    }
  }

  const handleSubmit = async (job: IJob): Promise<boolean> => {
    try {
      setLoading(true)
      if (job._id) {
        const { status, message } = await updatedJob(job)
        closeModal("job-modal")
        Swal.fire({ title: "Successfully!", icon: "success", text: message })
        return status
      } else {
        const { status, message } = await createJob(job)
        closeModal("job-modal")
        Swal.fire({ title: "Successfully!", icon: "success", text: message })
        return status
      }
    } catch (error) {
      return false
    } finally {
      await fetchData()
      setLoading(false)
    }
  }
  // hooks
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const {
        data,
        pagination: pg,
        status,
        message
      } = await fetchAllJob({
        page: pagination.page,
        limit: pagination.limit
      })
      if (status) {
        setJobData(data!)
        setPagination(pg!)
        return
      }
      Swal.fire({ title: "Error", text: message, icon: "error" })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchData()
  }, [fetchData, pagination.page, pagination.limit])

  return (
    <>
      <CardData
        title="Jobs"
        actions={
          <>
            <LimitControl
              pagination={pagination}
              setPagination={setPagination}
            />
            <PaginationControl
              pagination={pagination}
              setPagination={setPagination}
            />
            <button className="btn" onClick={setCreate}>
              <i className="bx bx-message-square-add"></i>
            </button>
          </>
        }
      >
        <JobTable
          data={jobData}
          loading={loading}
          pagination={pagination}
          onInfo={setEdit}
        />
      </CardData>
      <DialogModal id={"job-modal"} title={"New Job"}>
        <JobForm
          data={job}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          loading={loading}
        />
      </DialogModal>
    </>
  )
}
