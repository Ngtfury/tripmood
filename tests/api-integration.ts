async function runApiTests() {
  const baseUrl = 'http://localhost:3000/api/contributions';
  console.log('--- TESTING API ENDPOINTS ---');

  // 1. GET contributions
  const getRes = await fetch(baseUrl);
  const getJson = await getRes.json();
  console.log('GET /api/contributions:', getRes.status, getJson.success);
  if (getRes.status !== 200) throw new Error('GET failed');

  // 2. POST valid contribution for 2026-10-01
  const post1 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contribution_date: '2026-10-01',
      sreeram_amount: 50,
      niyaa_amount: 50,
      notes: 'Day 1 savings',
    }),
  });
  const post1Json = await post1.json();
  console.log('POST Oct 1 (50, 50):', post1.status, post1Json);
  if (post1.status !== 200 || !post1Json.success) throw new Error('Valid POST Oct 1 failed');

  // 3. POST valid contribution for Today (2026-10-02) with bonus
  const post2 = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contribution_date: '2026-10-02',
      sreeram_amount: 100,
      niyaa_amount: 50,
    }),
  });
  const post2Json = await post2.json();
  console.log('POST Today Oct 2 (100, 50):', post2.status, post2Json);
  if (post2.status !== 200 || !post2Json.success) throw new Error('Valid POST Oct 2 failed');

  // 4. Case 5: Attempt to contribute to tomorrow (2026-10-03)
  const postFuture = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contribution_date: '2026-10-03',
      sreeram_amount: 50,
      niyaa_amount: 50,
    }),
  });
  const futureJson = await postFuture.json();
  console.log('POST Tomorrow Oct 3 (Expected 400 rejection):', postFuture.status, futureJson.error);
  if (postFuture.status !== 400 || futureJson.error !== "That day hasn't happened yet ✦") {
    throw new Error('Future date was NOT rejected properly!');
  }

  // 5. Attempt invalid amount (₹25, between 1 and 49)
  const postInvalidAmt = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contribution_date: '2026-10-01',
      sreeram_amount: 25,
      niyaa_amount: 50,
    }),
  });
  const invalidAmtJson = await postInvalidAmt.json();
  console.log('POST ₹25 (Expected 400 rejection):', postInvalidAmt.status, invalidAmtJson.error);
  if (postInvalidAmt.status !== 400 || !invalidAmtJson.error.includes('at least ₹50')) {
    throw new Error('Invalid amount (1..49) was NOT rejected properly!');
  }

  console.log('ALL API BACKEND TESTS PASSED! 🚀');
}

runApiTests().catch((e) => {
  console.error('API Test Error:', e);
  process.exit(1);
});
