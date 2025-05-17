import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString("hex"); // Tạo salt ngẫu nhiên
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer; // Mã hóa mật khẩu với salt

    return `${buffer.toString("hex")}.${salt}`; // Trả về mật khẩu đã mã hóa và salt
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split("."); // Tách mật khẩu đã mã hóa và salt
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer; // Mã hóa mật khẩu cung cấp với salt

    return buffer.toString("hex") === hashedPassword; // So sánh mật khẩu đã mã hóa với mật khẩu đã lưu
  }
}
