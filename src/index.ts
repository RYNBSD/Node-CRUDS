import prompts from "prompts";
import CRUDS from "./cruds.js";

async function menu(): Promise<number> {
  console.log("0. Exit");
  console.log("1. Create");
  console.log("2. Read");
  console.log("3. Update");
  console.log("4. Delete");
  console.log("5. Search");

  const { choice } = await prompts({
    type: "number",
    name: "choice",
    message: "Enter your choice: ",
    validate: (choice: number) =>
      choice >= 0 && choice <= 5 ? true : "Choose between (0-5)",
  });

  return choice;
}

async function main() {
  const cruds = new CRUDS();

  while (true) {
    const choice = await menu();

    switch (choice) {
      case 0:
        await cruds.save()
        return;
      case 1:
        await cruds.create();
        break;
      case 2:
        cruds.read();
        break;
      case 3:
        await cruds.update();
        break;
      case 4:
        await cruds.delete();
        break;
      case 5:
        await cruds.search();
        break;
    }
  }
}

main();
