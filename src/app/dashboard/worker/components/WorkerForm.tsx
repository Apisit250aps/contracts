import { IWorker } from "@/models/workers"
import { FormEvent, useEffect, useState } from "react"

interface WorkerFormProps {
  data: IWorker
  onSubmit(data: IWorker): Promise<boolean>
}

export default function WorkerForm({ data, onSubmit }: WorkerFormProps) {
  const [form, setForm] = useState<Partial<IWorker>>({
    name: "",
    contact: "",
    _id: undefined
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const result = await onSubmit(form as IWorker)
    if (result) {
      setForm({ name: "", contact: "" } as IWorker)
    }
  }

  useEffect(() => {
    setForm({
      _id: data?._id,
      name: data?.name as string,
      contact: data?.contact as string
    })
  }, [data])

  return (
    <>
      <form className="mt-3" onSubmit={handleSubmit}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Worker Name</span>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={form.name}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Worker Contact</span>
          </div>
          <input
            type="text"
            name="contact"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={form.contact}
            onChange={handleChange}
          />
        </label>
        <div className="flex justify-end mt-3">
          <button type="submit" className="btn btn-outline">
            Create
          </button>
        </div>
      </form>
    </>
  )
}
