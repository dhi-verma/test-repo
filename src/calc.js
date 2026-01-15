/**
 * src/calc.js
 * Basic car emission calculator
 */

// UK Gov GHG Factors 2025 - Cars only
const FACTORS_2025 = {
  land: {
    car: {
      petrol: { unit: "vehicle.km", kgco2e_per_unit: 0.16272 },
      diesel: { unit: "vehicle.km", kgco2e_per_unit: 0.17304 }
    }
  }
};

const EMISSION_FACTORS = {
  land: {
    car: {
      petrol: { label: "Car (Petrol)", basis: "vehicle", unit: "vehicle.km", factor: 0.16272 },
      diesel: { label: "Car (Diesel)", basis: "vehicle", unit: "vehicle.km", factor: 0.17304 }
    }
  }
};

// Helper functions
function roundToTwo(num) {
  return Math.round(num * 100) / 100;
}

function milesToKm(miles) {
  return miles * 1.60934;
}

function normalizeDistance(distance, unit) {
  if (unit === "miles") return milesToKm(distance);
  return distance;
}

function normalizePassengers(passengers) {
  const p = Number(passengers);
  if (!Number.isFinite(p) || p < 1) return 1;
  return Math.floor(p);
}

// Main calculation function - CARS ONLY for now
function calculateLandEmissions(distance, unit, landType, option, passengers) {
  const distanceKm = normalizeDistance(Number(distance), unit);
  const pax = normalizePassengers(passengers);

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return { success: false, error: "Please enter a valid distance." };
  }

  // Only support cars for now
  if (landType !== 'car') {
    return { success: false, error: "Only cars supported in this version." };
  }

  const factorData = EMISSION_FACTORS.land.car[option];
  if (!factorData) {
    return { success: false, error: "Invalid car type selected." };
  }

  const factor = factorData.factor;
  const totalEmissions = factor * distanceKm;
  const perPersonEmissions = totalEmissions / pax;

  return {
    success: true,
    label: factorData.label,
    distanceKm: roundToTwo(distanceKm),
    passengers: pax,
    basis: "vehicle",
    factor: factor,
    factorUnit: "vehicle.km",
    perPerson: roundToTwo(perPersonEmissions),
    total: roundToTwo(totalEmissions)
  };
}

// Export
const CarbonCalc = {
  FACTORS_2025,
  EMISSION_FACTORS,
  calculateLandEmissions,
  roundToTwo,
  milesToKm
};

if (typeof window !== "undefined") {
  window.CarbonCalc = CarbonCalc;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = CarbonCalc;
}
