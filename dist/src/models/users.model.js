"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_interface_1 = require("../interfaces/users.interface");
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
        enum: users_interface_1.UserRole,
        required: true,
        default: users_interface_1.UserRole.ADMIN,
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
}, {
    timestamps: true,
    versionKey: false,
});
const UserModel = (0, mongoose_1.model)("users", UserSchema);
exports.default = UserModel;
