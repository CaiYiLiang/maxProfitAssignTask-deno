import { IFuel, ICar, IEmployee, ICarBillStatement } from "./types.d.ts";

export const getParkingRate = (carSize: string) => {
  if (carSize === "large") {
    return 35;
  }
  return 25;
};

export const isRequiredReFuel = (currentLevel: number, requiredLevel: number) =>
  currentLevel <= requiredLevel;

export const calReFuelRate = (refuel: number, unitPrice: number) =>
  refuel * unitPrice;

export const getReFuelRate = (
  fuelInfo: IFuel,
  requireReFuelLevel = 0.1,
  fuelUnitPrice = 1.75
) => {
  const { capacity, level } = fuelInfo;
  let refuelRate = 0;
  let refuelAmount = 0;

  if (isRequiredReFuel(level, requireReFuelLevel)) {
    const currentFuelLevel = capacity * level;
    refuelAmount = capacity - currentFuelLevel;
    refuelRate = calReFuelRate(refuelAmount, fuelUnitPrice);
    // console.log(
    //   `car: refuelAmount - ${refuelAmount}, refuelRate - ${refuelRate}`
    // );
  }

  return [refuelRate, refuelAmount];
};

export const getCarServiceRate = (car: ICar) => {
  const { size, fuel } = car;
  const parkingRate = getParkingRate(size);
  const [fuelRate, fuelAdded] = getReFuelRate(fuel);
  const totalRate = parkingRate + fuelRate;
  // console.log(
  //   `car: parkingRate - ${parkingRate}, fuelRate - ${fuelRate}, totalRate - ${totalRate}`
  // );
  return [parseFloat(totalRate.toFixed(2)), fuelAdded];
};

export const getAllCarsBillStatement = (cars: Array<ICar>) => {
  const allCarsBillStatement: Array<ICarBillStatement> = cars.map((car) => {
    const [carServiceRate, fuelAdded] = getCarServiceRate(car);
    return { ...car, price: carServiceRate, fuelAdded };
  });

  // console.log("allCarsRate", allCarsBillStatement);
  return allCarsBillStatement;
};

export const carServiceAssigner = (
  cars: Array<ICar>,
  employees: Array<IEmployee>
) => {
  if (cars.length > 0) {
    const allCarsBillStatement = getAllCarsBillStatement(cars);
    const sortedCarsBillStatement = allCarsBillStatement.sort(
      (carA, carB) => carA.price - carB.price
    );

    const staffCapacity = employees.length;
    const sortedEmployees = employees.sort(
      (employeeA, employeeB) => employeeB.commission - employeeA.commission
    );
    // console.log("sortedEmployees", sortedEmployees);

    const assignWorkload = Math.round(
      sortedCarsBillStatement.length / staffCapacity
    );
    let extraWorkload =
      sortedCarsBillStatement.length - assignWorkload * staffCapacity;
    // console.log("assignWorkload", assignWorkload);
    // console.log("extraWorkload", extraWorkload);
    // console.log("------");

    let profit = 0;
    let startIdx = 0;

    sortedEmployees.forEach((employeeInfo) => {
      const extraWorkloadRequired = extraWorkload > 0 ? 1 : 0;
      const endIdx =
        startIdx + assignWorkload + extraWorkloadRequired >=
        sortedCarsBillStatement.length
          ? sortedCarsBillStatement.length
          : startIdx + assignWorkload + extraWorkloadRequired;
      for (let k = startIdx; k < endIdx; k++) {
        sortedCarsBillStatement[k].employee = employeeInfo.employee;
        const deductedCommissionRate =
          sortedCarsBillStatement[k].price -
          sortedCarsBillStatement[k].price * employeeInfo.commission;
        profit += deductedCommissionRate;
        // console.log("sortedCarsRate", sortedCarsBillStatement[k]);
      }
      extraWorkload--;
      startIdx = endIdx;
    });

    console.log("profit", parseFloat(profit.toFixed(2)));
    return sortedCarsBillStatement;
  }
};
