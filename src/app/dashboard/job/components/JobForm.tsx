import { IJob } from "@/models/jobs"
import { FormEvent, useEffect, useState } from "react"

interface JobFormProps {
  data: IJob
  onSubmit(data: IJob): Promise<boolean>
  onDelete?(jobId: string): Promise<boolean>
}

export default function JobForm({ data, onSubmit, onDelete }: JobFormProps) {
  const [form, setForm] = useState<Partial<IJob>>({
    title: "",
    description: "",
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
    const result = await onSubmit(form as IJob)
    if (result) {
      setForm({ title: "", description: "" } as IJob)
    }
  }

  const handleDelete = async () => {
    if (form._id) {
      const result = await onDelete!(form._id as string)
      if (result) {
        setForm({ title: "", description: "" } as IJob)
      }
    }
  }

  useEffect(() => {
    setForm({
      _id: data?._id,
      title: data?.title as string,
      description: data?.description as string
    })
  }, [data])

  return (
    <>
      <form className="mt-3" onSubmit={handleSubmit}>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Job Title</span>
          </div>
          <input
            type="text"
            name="title"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={form.title}
            onChange={handleChange}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Job Description</span>
          </div>
          <input
            type="text"
            name="description"
            placeholder="Type here"
            className="input input-bordered w-full"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <div className="flex justify-end mt-3">
          {form._id ? (
            <>
              {onDelete ? (
                <>
                  <button
                    type="button"
                    className="btn bg-red-500 text-white me-3"
                    onClick={handleDelete}
                  >
                    <i className="bx bx-trash"></i>
                  </button>
                </>
              ) : null}
            </>
          ) : null}
          <button type="submit" className="btn btn-outline">
            Submit
          </button>
        </div>
      </form>
    </>
  )
}
