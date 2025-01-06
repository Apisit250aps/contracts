import { Document, model, models, ObjectId, Schema } from "mongoose"
import Attendance from "./attendances"

export interface IJob extends Document {
  _id: string
  title: string
  description: string
  assignedWorkers?: ObjectId[]
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

jobSchema.pre("findOneAndDelete", async function (next) {
  try {
    // Access the jobId from the query (this.getQuery() gives you the query object)
    const jobId = this.getQuery()["_id"]
    // Delete related attendance records
    await Attendance.deleteMany({ jobId })
    // Proceed with the delete operation
    next()
  } catch (error) {
    console.error(error)
    next() // If any error occurs, pass it to the next middleware or handler
  }
})

const Job = models.jobs || model<IJob>("jobs", jobSchema)
export default Job