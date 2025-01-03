import { Document, model, Schema } from "mongoose"
import bcrypt from "bcrypt"
//
export interface IUser extends Document {
  _id: string
  username: string
  password: string
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
  authentication: (password: string) => boolean
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  this.password = bcrypt.hashSync(this.password, 10)
  next()
})

userSchema.methods.authentication = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

const User = model<IUser>("users", userSchema)
export default User
