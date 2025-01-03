import { Document, model, ObjectId, Schema } from "mongoose"

export interface IJob extends Document {
  _id: string
  title: string
  description: string
  assignedWorkers: ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const jobSchema = new Schema<IJob>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    assignedWorkers: {
      type: [Schema.Types.ObjectId],
      ref: "workers"
    }
  },
  {
    timestamps: true
  }
)

const Job = model<IJob>("jobs", jobSchema)
export default Job
