// ***************
// IMPORTS
// ***************
import { parse, green, bold, red, cyan } from "./deps.ts";
import { displayHelpAndQuit } from "./error.ts";
import { carServiceAssigner } from "./maxProfitAssignTask.ts";
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
  } else if (parsedArgs.data && parsedArgs.employee) {
    const cars = JSON.parse(parse(args).data);
    const employees = JSON.parse(parse(args).employee);
    const sortedCarsBillStatement = carServiceAssigner(cars, employees);
    console.log("Result:", sortedCarsBillStatement);
    Deno.exit();
  } else displayHelpAndQuit("Invalid argument");
}
