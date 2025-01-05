import { Document, model, models, ObjectId, Schema } from "mongoose"

export interface IWorker extends Document {
  _id: ObjectId
  name: string
  contact: string
  createdAt: Date
  updatedAt: Date
}

const workerSchema = new Schema<IWorker>(
  {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Worker = models.workers || model<IWorker>("workers", workerSchema)
export default Worker
