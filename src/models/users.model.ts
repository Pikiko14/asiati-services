import { User, UserRole } from "../interfaces/users.interface";
import { Schema, model } from "mongoose";

const UserSchema = new Schema<User>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: UserRole,
      required: true,
      default: UserRole.ADMIN,
    },
    scopes: {
      type: [String],
    },
    recovery_token: {
      type: String,
      required: false,
      default: null,
    },
    profile_pictury: {
      type: String,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    confirmation_token: {
      type: String,
      required: false,
      default: null,
    },
    phone: {
      type: String,
      required: false,
      default: null,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model("users", UserSchema);

export default UserModel;
