// ***************
// IMPORTS
// ***************
import { parse, green, bold, cyan, readJson, writeJson } from "./deps.ts";
import { displayHelpAndQuit } from "./error.ts";
import { carServiceAssigner } from "./maxProfitAssignTask.ts";
import { IEmployee, ICar } from "./types.d.ts";

// ***************
// FUNCTIONS
// ***************

const displayBanner = (): void => {
  // Clears the terminal
  console.clear();
  console.log(bold("---------------"));
  console.log(bold(cyan(`Parking service assign CLI`)));
  console.log(cyan(`By CherryLiang`));
  console.log(bold("---------------"));
  console.log(
    bold(
      cyan(
        `\nTry ${green(`--help`)} for further information. Powered by Deno\n`
      )
    )
  );
};

// ***************
// Main method
// ***************
if (import.meta.main) {
  const { args } = Deno;
  const parsedArgs = parse(args);
  displayBanner();
  if (args.length === 0 || parsedArgs.h || parsedArgs.help) {
    displayHelpAndQuit();
  } else if (parsedArgs.db || (parsedArgs.data && parsedArgs.employee)) {
    let carsData, employeesData;
    try {
      if (parsedArgs.data && parsedArgs.employee) {
        const cars = JSON.parse(parse(args).data);
        const employees = JSON.parse(parse(args).employee);
        console.log(cyan("---- Writing Data into JSON file ----"));
        await writeJson("./db/cars.json", cars);
        await writeJson("./db/employees.json", employees);
        console.log(cyan("---- Finish: Update cars.json|employees.json ----"));
      }

      console.log(cyan("---- Reading data from DB ----"));
      carsData = (await readJson("./db/cars.json")) as Array<ICar>;
      employeesData = (await readJson(
        "./db/employees.json"
      )) as Array<IEmployee>;
      console.log(
        cyan("---- Finish: Get data from cars.json|employees.json ----")
      );

      const sortedCarsBillStatement = carServiceAssigner(
        carsData,
        employeesData
      );
      console.log("Result:", sortedCarsBillStatement);
      Deno.exit();
    } catch (err) {
      displayHelpAndQuit(err?.message || "Invalid argument");
    }
  } else displayHelpAndQuit("Invalid argument");
}
