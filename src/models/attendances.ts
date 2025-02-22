import { Document, model, models, ObjectId, Schema } from "mongoose"

export interface IAttendance extends Document {
  _id: ObjectId
  jobId: ObjectId
  date: Date
  records: { worker: ObjectId; status: boolean }[]
  createdAt: Date
  updatedAt: Date
}

const attendanceSchema = new Schema<IAttendance>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "jobs",
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    records: [
      {
        worker: {
          type: Schema.Types.ObjectId,
          ref: "workers",
          required: true
        },
        status: {
          type: Boolean,
          required: true,
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

const Attendance =
  models.attendances || model<IAttendance>("attendances", attendanceSchema)
export default Attendance
