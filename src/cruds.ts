import type { TArrUser, TUser } from "./schema.js";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { writeFile } from "fs/promises";
import prompts from "prompts";
import { ArrUser, isEmail } from "./schema.js";

export default class CRUDS {
  private readonly db: string = "db.json";
  private users: TArrUser = [];

  constructor() {
    if (!existsSync(this.db)) {
      writeFileSync(this.db, "[]");
    } else {
      const buffer = readFileSync(this.db);
      this.users = JSON.parse(buffer.toString());
      ArrUser.parse(this.users);
    }
  }

  async save() {
    const stringify = JSON.stringify(this.users, null, 2);
    await writeFile(this.db, stringify);
  }

  async create() {
    const { name } = await prompts({
      type: "text",
      name: "name",
      message: "Enter your name: ",
      validate: (name: string) => (name.length > 0 ? true : "Name is required"),
    });

    const { email } = await prompts({
      type: "text",
      name: "email",
      message: "Enter your email: ",
      validate: (email: string) =>
        isEmail.safeParse(email).success ? true : "Email is required",
    });

    const newUser: TUser = {
      id: Date.now(),
      name,
      email,
    };

    this.users.push(newUser);
    await this.save();
  }

  read() {
    console.table(this.users);
  }

  async update() {
    const { id } = await prompts({
      type: "number",
      name: "id",
      message: "Enter your id: ",
      validate: (id: number) => (id > 0 ? true : "Id is required"),
    });

    const index = this.users.findIndex((user) => user.id === id);
    if (index < 0) {
      console.log("User not found");
      return;
    }

    const user = this.users[index]!;
    const { name } = await prompts({
      type: "text",
      name: "name",
      initial: user.name,
      message: "Update your name: ",
      validate: (name: string) => (name.length > 0 ? true : "Name is required"),
    });

    const { email } = await prompts({
      type: "text",
      name: "email",
      initial: user.email,
      message: "Update your email: ",
      validate: (email: string) =>
        isEmail.safeParse(email).success ? true : "Email is required",
    });

    this.users[index]!.name = name;
    this.users[index]!.email = email;
    await this.save();
  }

  async delete() {
    const { id } = await prompts({
      type: "number",
      name: "id",
      message: "Enter your id: ",
      validate: (id: number) => (id > 0 ? true : "Id is required"),
    });

    const index = this.users.findIndex((user) => user.id === id);

    if (index < -1) {
      console.log("User not found");
      return;
    }

    this.users.splice(index, 1);
    await this.save();
  }

  async search() {
    const { text } = await prompts({
      type: "text",
      name: "text",
      message: "Search: ",
      validate: (text: string) =>
        text.length > 0 ? true : "Your have to enter a key",
    });

    const searchByEmail = isEmail.safeParse(text).success;
    const result: TArrUser = [];

    if (searchByEmail) {
      const r = this.users.filter((user) =>
        user.email.toLowerCase().includes(text.toLowerCase())
      );
      result.push(...r);
    } else {
      const r = this.users.filter((user) =>
        user.name.toLowerCase().includes(text.toLowerCase())
      );
      result.push(...r);
    }

    if (result.length > 0) {
      console.table(result);
    } else {
      console.log("Nothing found");
    }
  }
}
