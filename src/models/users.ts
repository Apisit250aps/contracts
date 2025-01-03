import { Document, model, models, Schema } from "mongoose"
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

// Pre-save hook for password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next();
  }
});

// Add authentication method
userSchema.methods.authentication = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = models.users|| model<IUser>("users", userSchema)
export default User
