"use client"

import { IWorker } from "@/models/workers"
import { fetchAllWorker } from "@/services/workerServices"
import PaginationControl from "@/shared/components/navigation/PaginationControl"
import { IPagination } from "@/shared/repository/services"
import { useCallback, useEffect, useState, useRef } from "react"

interface WorkerSelectProp {
  onExport(worker: IWorker[]): void
  selected: string[]
}

export default function JobWorkerSelect({
  onExport,
  selected
}: WorkerSelectProp) {
  const [loading, setLoading] = useState<boolean>(false)
  const [workerData, setWorkerData] = useState<IWorker[]>([])
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set(selected))
  // Store all worker data from previous pages
  const previousWorkersRef = useRef<Map<string, IWorker>>(new Map())

  // Update internal state when external selected prop changes
  useEffect(() => {
    setSelectedWorkers(new Set(selected))
  }, [selected])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchAllWorker({
        page: pagination.page,
        limit: pagination.limit
      })
      if (res.status === 200) {
        // Store current page data in previousWorkers before updating
        workerData.forEach(worker => {
          previousWorkersRef.current.set(worker._id, worker)
        })
        setWorkerData(res.data.data!)
        setPagination(res.data.pagination)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    fetchData()
  }, [fetchData, pagination.page, pagination.limit])

  const getAllSelectedWorkers = (selectedIds: Set<string>): IWorker[] => {
    const currentPageSelected = workerData.filter(worker => selectedIds.has(worker._id))
    const previousPagesSelected = Array.from(selectedIds)
      .map(id => previousWorkersRef.current.get(id))
      .filter((worker): worker is IWorker => worker !== undefined)
    
    // Combine and remove duplicates using Map
    const uniqueWorkers = new Map<string, IWorker>()
    
    // Add current page selected workers
    currentPageSelected.forEach(worker => {
      uniqueWorkers.set(worker._id, worker)
    })
    
    // Add previous pages selected workers
    previousPagesSelected.forEach(worker => {
      if (!uniqueWorkers.has(worker._id)) {
        uniqueWorkers.set(worker._id, worker)
      }
    })
    
    return Array.from(uniqueWorkers.values())
  }

  // Handle individual worker selection
  const handleWorkerSelect = (workerId: string) => {
    setSelectedWorkers(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(workerId)) {
        newSelected.delete(workerId)
      } else {
        newSelected.add(workerId)
      }
      
      const allSelectedWorkers = getAllSelectedWorkers(newSelected)
      onExport(allSelectedWorkers)
      return newSelected
    })
  }

  // Handle select all for current page
  const handleSelectAll = (checked: boolean) => {
    setSelectedWorkers(prev => {
      const newSelected = new Set(prev)
      workerData.forEach(worker => {
        if (checked) {
          newSelected.add(worker._id)
        } else {
          newSelected.delete(worker._id)
        }
      })
      
      const allSelectedWorkers = getAllSelectedWorkers(newSelected)
      onExport(allSelectedWorkers)
      return newSelected
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={
                    workerData.length > 0 &&
                    workerData.every(worker => selectedWorkers.has(worker._id))
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </label>
            </th>
            <th>Name</th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} className="text-center">
                <span className="loading loading-dots loading-sm"></span>
              </td>
            </tr>
          ) : (
            <>
              {!workerData.length ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No data found
                  </td>
                </tr>
              ) : (
                <>
                  {workerData.map((worker, index) => (
                    <tr key={worker._id || index}>
                      <th>
                        <label>
                          <input
                            type="checkbox"
                            className="checkbox"
                            checked={selectedWorkers.has(worker._id)}
                            onChange={() => handleWorkerSelect(worker._id)}
                          />
                        </label>
                      </th>
                      <td>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-bold">{worker.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="">{worker.contact}</div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} className="text-end">
              <PaginationControl
                pagination={pagination}
                setPagination={setPagination}
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}