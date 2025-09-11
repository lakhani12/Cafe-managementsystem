import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		password: { type: String, required: true, minlength: 6, select: false },
		role: { type: String, enum: ["user", "admin"], default: "user", index: true },
		active: { type: Boolean, default: true, index: true },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date }
	},
	{ timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
	if (!this.isModified("password")) return next();
	const saltRounds = 10;
	this.password = await bcrypt.hash(this.password, saltRounds);
	next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate) {
	return bcrypt.compare(candidate, this.password);
};

userSchema.methods.generatePasswordReset = function generatePasswordReset() {
	const resetToken = crypto.randomBytes(32).toString("hex");
	this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
	this.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
	return resetToken;
};

export const User = mongoose.model("User", userSchema);


