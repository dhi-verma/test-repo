/**
 * script.js
 * Basic UI logic for car calculator
 */

(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }

  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : NaN;
  }

  function format2(num) {
    const n = toNumber(num);
    if (!Number.isFinite(n)) return '-';
    return n.toFixed(2);
  }

  function formatDistance(num) {
    const n = toNumber(num);
    if (!Number.isFinite(n)) return '-';
    return Number.isInteger(n) ? String(n) : n.toFixed(2);
  }

  // DOM elements
  const form = $('calcForm');
  const distanceEl = $('distance');
  const unitEl = $('unit');
  const passengersEl = $('passengers');
  const carTypeEl = $('carType');
  const resultsSection = $('resultsSection');
  const resultsTitleEl = $('resultsTitle');
  const outDistanceEl = $('outDistance');
  const outPerPersonEl = $('outPerPerson');
  const outTotalEl = $('outTotal');
  const outBasisEl = $('outBasis');
  const errorEl = $('error');
  const clearBtn = $('clearBtn');

  function show(el, visible) {
    if (!el) return;
    el.style.display = visible ? '' : 'none';
  }

  function showError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg;
    show(errorEl, true);
  }

  function clearMessages() {
    if (errorEl) {
      errorEl.textContent = '';
      show(errorEl, false);
    }
  }

  function renderResult(result) {
    show(resultsSection, true);
    
    if (resultsTitleEl) resultsTitleEl.textContent = result.label;
    if (outDistanceEl) outDistanceEl.textContent = `${formatDistance(result.distanceKm)} km`;
    if (outPerPersonEl) outPerPersonEl.textContent = `${format2(result.perPerson)} kg CO₂e`;
    if (outTotalEl) outTotalEl.textContent = `${format2(result.total)} kg CO₂e`;
    
    if (outBasisEl) {
      outBasisEl.textContent = 'Basis: vehicle-km (total for vehicle, shared across passengers)';
    }
  }

  // Calculate on submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearMessages();

      const distance = toNumber(distanceEl.value);
      const unit = unitEl.value;
      const passengers = Math.floor(toNumber(passengersEl.value)) || 1;
      const carType = carTypeEl.value;

      if (!Number.isFinite(distance) || distance <= 0) {
        showError('Please enter a valid distance (greater than 0).');
        return;
      }

      const result = CarbonCalc.calculateLandEmissions(
        distance, unit, 'car', carType, passengers
      );

      if (!result.success) {
        showError(result.error || 'Calculation failed.');
        return;
      }

      renderResult(result);
    });
  }

  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearMessages();
      if (distanceEl) distanceEl.value = '10';
      if (unitEl) unitEl.value = 'km';
      if (passengersEl) passengersEl.value = '1';
      if (carTypeEl) carTypeEl.value = 'petrol';
      show(resultsSection, false);
    });
  }

  // Init
  show(resultsSection, false);
  clearMessages();
})();
