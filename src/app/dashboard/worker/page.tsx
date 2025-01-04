"use client"

import {
  closeModal,
  DialogModal,
  openModal
} from "@/shared/components/actions/Modal"
import { CardData } from "@/shared/components/display/cards"
import WorkerForm from "./components/WorkerForm"
import { IWorker } from "@/models/workers"
import { SetStateAction, use, useCallback, useEffect, useState } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import WorkerTable from "./components/WorkerTable"
import { IPagination } from "@/shared/repository/services"
import PaginationControl from "@/shared/components/navigation/PaginationControl"

export default function DashboardWorker() {
  const [worker, setWorker] = useState<IWorker>({
    name: "",
    contact: ""
  } as IWorker)
  const [workerData, setWorkerData] = useState<IWorker[]>([])
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const handleSubmit = async (worker: IWorker) => {
    try {
      if (worker._id) {
      } else {
        const res = await axios({
          method: "post",
          url: "/api/worker",
          data: worker
        })
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
    }
  }
  const fetchData = useCallback(async () => {
    try {
      const res = await axios({
        method: "get",
        url: "/api/worker",
        params: {
          page: pagination.page,
          limit: pagination.limit
        }
      })
      if (res.status === 200) {
        setWorkerData(res.data.data)
        setPagination(res.data.pagination)
      }
    } catch (error) {
      console.log(error)
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
  }, [fetchData])
  return (
    <>
      <DialogModal id={"worker-form-dialog"} title={"New Worker"}>
        <WorkerForm onSubmit={handleSubmit} data={worker} />
      </DialogModal>
      <CardData
        title="Workers"
        actions={
          <>
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
        <WorkerTable data={workerData} />
      </CardData>
    </>
  )
}
