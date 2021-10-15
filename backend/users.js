import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const users = new mongoose.Schema({
  username: String,
  password: String,
});

users.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew()) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(user.password, salt, (hashErr, hash) => {
          if (hashErr) {
            return next(err);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });
  } else {
    return next();
  }
});

export default mongoose.model("users", users);
