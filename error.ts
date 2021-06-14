import { red, bold, cyan } from "./deps.ts";

// Shows help text, error message(if present) and exits the program
export const displayHelpAndQuit = (error?: string): void => {
  if (error) {
    console.log(bold(red(`Error: ${error}`)));
  }

  console.log(`Usage: assign parking services task with max profit\n`);
  console.log(`Optional flags:`);
  console.log(`   ${bold("-h, --help")}\t\t Shows this help message and exits`);
  console.log(
    `   ${bold(
      "--data"
    )}\t\t Car List with required information: size, fuel level and capacity`
  );
  console.log(
    `   ${bold(
      "--employee"
    )}\t\t Employee List with required information: name and commission`
  );

  // Exits the program
  Deno.exit();
};
