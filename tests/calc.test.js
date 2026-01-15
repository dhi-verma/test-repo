/**
 * tests/calc.test.js
 * Jest tests for car calculations
 */

const CarbonCalc = require('../src/calc');

describe('CarbonCalc - car calculations', () => {
  test('car (petrol) 10 km, 1 passenger -> correct total', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'km', 'car', 'petrol', 1);

    expect(r.success).toBe(true);
    expect(r.basis).toBe('vehicle');
    expect(r.label).toBe('Car (Petrol)');
    expect(r.total).toBeCloseTo(1.63, 2);
    expect(r.perPerson).toBeCloseTo(1.63, 2);
  });

  test('car (petrol) 10 km, 2 passengers -> total same, per-person halves', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'km', 'car', 'petrol', 2);

    expect(r.success).toBe(true);
    expect(r.total).toBeCloseTo(1.63, 2);
    expect(r.perPerson).toBeCloseTo(0.81, 2);
  });

  test('car (diesel) 10 km, 1 passenger -> correct emissions', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'km', 'car', 'diesel', 1);

    expect(r.success).toBe(true);
    expect(r.label).toBe('Car (Diesel)');
    expect(r.total).toBeCloseTo(1.73, 2);
  });

  test('miles convert to km correctly', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'miles', 'car', 'petrol', 1);

    expect(r.success).toBe(true);
    expect(r.distanceKm).toBeCloseTo(16.09, 2);
    expect(r.total).toBeCloseTo(2.62, 2);
  });

  test('invalid distance returns error', () => {
    const r = CarbonCalc.calculateLandEmissions('', 'km', 'car', 'petrol', 1);
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/valid distance/i);
  });

  test('zero distance returns error', () => {
    const r = CarbonCalc.calculateLandEmissions(0, 'km', 'car', 'petrol', 1);
    expect(r.success).toBe(false);
  });

  test('negative distance returns error', () => {
    const r = CarbonCalc.calculateLandEmissions(-5, 'km', 'car', 'petrol', 1);
    expect(r.success).toBe(false);
  });

  test('passengers less than 1 defaults to 1', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'km', 'car', 'petrol', 0);
    expect(r.success).toBe(true);
    expect(r.passengers).toBe(1);
  });

  test('invalid car type returns error', () => {
    const r = CarbonCalc.calculateLandEmissions(10, 'km', 'car', 'rocket', 1);
    expect(r.success).toBe(false);
    expect(r.error).toMatch(/invalid/i);
  });
});
