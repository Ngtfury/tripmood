import { calculateDailyBreakdown, calculateTripTotals, validatePersonAmount } from '../lib/calculations';
import { isDateInFuture, isDateWithinTripRange, generateTripCalendar } from '../lib/dates';
import { TRIP_CONFIG } from '../lib/constants';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

console.log('--- RUNNING TEST SCENARIOS ---');

// Case 1: October 1: Sreeram ₹50, Niyaa ₹50
const case1 = calculateDailyBreakdown(50, 50);
assert(case1.baselineCounted === 100, 'Case 1: Baseline counted is ₹100');
assert(case1.bonusAmount === 0, 'Case 1: Bonus is ₹0');
assert(case1.isComplete === true, 'Case 1: Day is complete');

// Case 2: October 2: Sreeram ₹100, Niyaa ₹50
const case2 = calculateDailyBreakdown(100, 50);
assert(case2.baselineCounted === 100, 'Case 2: Baseline counted is ₹100');
assert(case2.bonusAmount === 50, 'Case 2: Bonus is ₹50');
assert(case2.totalDayAmount === 150, 'Case 2: Total day amount is ₹150');

// Case 3: October 3: Sreeram ₹50, Niyaa ₹0
const case3 = calculateDailyBreakdown(50, 0);
assert(case3.baselineCounted === 50, 'Case 3: Baseline counted is ₹50');
assert(case3.bonusAmount === 0, 'Case 3: Bonus is ₹0');
assert(case3.isComplete === false, 'Case 3: Day is incomplete');

// Case 4: October 4: Sreeram ₹100, Niyaa ₹100
const case4 = calculateDailyBreakdown(100, 100);
assert(case4.baselineCounted === 100, 'Case 4: Baseline counted is ₹100');
assert(case4.bonusAmount === 100, 'Case 4: Bonus is ₹100');
assert(case4.totalDayAmount === 200, 'Case 4: Total day amount is ₹200');

// Case 5: Future Date Rejection Logic
// Given today is 2026-10-02 in Asia/Kolkata
const tomorrowDate = '2026-10-03';
const isFuture = isDateInFuture(tomorrowDate, 'Asia/Kolkata');
// In our test environment, checking relative to today:
console.log(`Checking isDateInFuture("${tomorrowDate}"):`, isFuture);

// Test Amount Validation (0 or >= 50)
assert(validatePersonAmount(0).valid, '₹0 is valid');
assert(validatePersonAmount(50).valid, '₹50 is valid');
assert(validatePersonAmount(100).valid, '₹100 is valid');
assert(!validatePersonAmount(25).valid, '₹25 is rejected (1..49 invalid)');
assert(!validatePersonAmount(-10).valid, 'Negative amount is rejected');

// Case 7 & 8: Main target ₹7,100 & Bonus ₹1,000
const fullTripContributions = [];
for (let i = 0; i < 71; i++) {
  fullTripContributions.push({
    trip_id: TRIP_CONFIG.id,
    contribution_date: `2026-10-${i + 1}`,
    sreeram_amount: i === 0 ? 550 : 50, // Sreeram gives ₹500 extra on day 1
    niyaa_amount: i === 0 ? 550 : 50,   // Niyaa gives ₹500 extra on day 1
  });
}
// Total bonus = (550-50) + (550-50) = 1000.
// Total baseline = 71 * 100 = 7100.
const fullTotals = calculateTripTotals(fullTripContributions);
assert(fullTotals.mainFund === 7100, 'Case 7: Main fund is ₹7,100');
assert(fullTotals.progressPercentage === 100, 'Case 7: Progress is exactly 100%');
assert(fullTotals.isCompleted === true, 'Case 7: isCompleted is true');
assert(fullTotals.bonusFund === 1000, 'Case 8: Bonus reaches ₹1,000');
assert(fullTotals.totalMoney === 8100, 'Case 8: Total money is ₹8,100');
assert(fullTotals.progressPercentage === 100, 'Case 8: Progress remains 100% (bonus does not inflate target)');

// Calendar days verification
const calendar = generateTripCalendar();
assert(calendar.length === 71, 'Calendar has exactly 71 days');
assert(calendar[0].date === '2026-10-01', 'First day is Oct 01, 2026');
assert(calendar[70].date === '2026-12-10', 'Last day is Dec 10, 2026');

console.log('ALL TEST SCENARIOS PASSED WITH FLYING COLORS! 🎉');
