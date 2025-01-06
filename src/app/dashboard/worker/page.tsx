"use client"

import {
  closeModal,
  DialogModal,
  openModal
} from "@/shared/components/actions/Modal"
import { CardData } from "@/shared/components/display/cards"
import WorkerForm from "./components/WorkerForm"
import { IWorker } from "@/models/workers"
import { useCallback, useEffect, useState } from "react"
import Swal from "sweetalert2"
import WorkerTable from "./components/WorkerTable"
import { IPagination } from "@/shared/repository/services"
import PaginationControl, {
  LimitControl
} from "@/shared/components/navigation/PaginationControl"
import { createWorker, fetchAllWorker } from "@/services/workerServices"

export default function DashboardWorker() {
  const [loading, setLoading] = useState<boolean>(false)
  const [workerData, setWorkerData] = useState<IWorker[]>([])
  const [worker, setWorker] = useState<IWorker>({
    name: "",
    contact: ""
  } as IWorker)
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  // submit create or update worker
  const handleSubmit = async (worker: IWorker) => {
    try {
      setLoading(true)
      if (worker._id) {
      } else {
        const res = await createWorker(worker)

        if (res.status === 201) {
          closeModal("worker-form-dialog")
          Swal.fire({
            title: "Successfully!",
            icon: "success",
            text: "Create Worker Successfully!"
          })
        }
      }
      return true
    } catch (error) {
      return false
    } finally {
      await fetchData()
      setLoading(false)
    }
  }
  // fetch all worker
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchAllWorker({
        page: pagination.page,
        limit: pagination.limit
      })
      if (res.status === 200) {
        setWorkerData(res.data.data!)
        setPagination(res.data.pagination)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  const setEdit = (worker: IWorker) => {
    setWorker(worker)
    openModal("worker-form-dialog")
  }
  const setCreate = () => {
    openModal("worker-form-dialog")
  }

  useEffect(() => {
    fetchData()
  }, [fetchData, pagination.page, pagination.limit])

  return (
    <>
      <CardData
        title="Workers"
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
        <WorkerTable
          data={workerData}
          loading={loading}
          pagination={pagination}
        />
      </CardData>
      <DialogModal id={"worker-form-dialog"} title={"New Worker"}>
        <WorkerForm onSubmit={handleSubmit} data={worker} />
      </DialogModal>
    </>
  )
}
