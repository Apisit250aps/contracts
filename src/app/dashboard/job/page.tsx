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
import { createJob, fetchAllJob } from "@/services/jobServices"
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
  const handleSubmit = async (job: IJob): Promise<boolean> => {
    try {
      setLoading(true)
      if (job._id) {
      } else {
        const res = await createJob(job)
        if (res.status !== 201) {
          return false
        }
        closeModal("job-modal")
        Swal.fire({
          title: "Successfully!",
          icon: "success",
          text: "Create Worker Successfully!"
        })
      }
      return true
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
      const res = await fetchAllJob({
        page: pagination.page,
        limit: pagination.limit
      })
      if (res.status === 200) {
        setJobData(res.data.data!)
        setPagination(res.data.pagination)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchData()
  }, [fetchData, pagination.page, pagination.limit])

  return (
    <>
      <DialogModal id={"job-modal"} title={"New Job"}>
        <JobForm data={job} onSubmit={handleSubmit} />
      </DialogModal>
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
        <JobTable data={jobData} loading={loading} />
      </CardData>
    </>
  )
}
