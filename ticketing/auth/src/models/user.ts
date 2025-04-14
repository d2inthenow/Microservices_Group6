import mongoose from "mongoose";
import { Password } from "../services/password";
// Định nghĩa interface cho các thuộc tính của User
// Đây là các thuộc tính mà chúng ta sẽ truyền vào khi tạo một instance của User
// Chúng ta sử dụng interface này để đảm bảo rằng các thuộc tính này là bắt buộc và có kiểu dữ liệu đúng
interface UserAttrs {
  email: string;
  password: string;
}

// Định nghĩa interface cho Model của MongoDB
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc; // Phương thức build để tạo một instance của User
}

// Định nghĩa interface cho Document của MongoDB
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Mã hóa mật khẩu trước khi lưu vào MongoDB
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password")); // Mã hóa mật khẩu
    this.set("password", hashed); // Lưu mật khẩu đã mã hóa vào MongoDB
  }
  done(); // Gọi hàm done để tiếp tục quá trình lưu
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

const user = User.build({
  email: "duong0023@gmail.com",
  password: "123456",
});

export { User };
