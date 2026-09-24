const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { app } = require('../server');

const TEST_EMAIL = `testuser_${Date.now()}@example.com`;
const TEST_PASSWORD = 'Password123!';

let server;
let token;

async function startTestServer() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fsd_ecommerce');
  server = app.listen(0);
  await new Promise((resolve) => server.on('listening', resolve));
}

async function stopTestServer() {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }
  await mongoose.disconnect();
}

test.before(async () => {
  await startTestServer();
});

test.after(async () => {
  await stopTestServer();
});

test('signup creates a user', async () => {
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  const data = await response.json();
  assert.equal(response.status, 201);
  assert.equal(data.message, 'Signup Sucessful');
  assert.equal(data.User.email, TEST_EMAIL);
});

test('login returns a token and user profile', async () => {
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    }),
  });

  const data = await response.json();
  token = data.token;

  assert.equal(response.status, 200);
  assert.equal(data.user.email, TEST_EMAIL);
  assert.ok(data.token);

  const profileResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/auth/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const profileData = await profileResponse.json();
  assert.equal(profileResponse.status, 200);
  assert.equal(profileData.user.email, TEST_EMAIL);
});

test('save-order stores an order for the logged-in user', async () => {
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/payment/save-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      items: [
        {
          productId: 'demo-product-1',
          prod_name: 'Apple',
          price: 120,
          quantity: 2,
        },
      ],
      amount: 240,
      paymentId: 'pay_test_123',
      orderId: 'demo-order-123',
    }),
  });

  const data = await response.json();
  assert.equal(response.status, 201);
  assert.equal(data.message, 'Order saved successfully');
  assert.equal(data.order.amount, 240);

  const ordersResponse = await fetch(`http://127.0.0.1:${server.address().port}/api/payment/my-orders`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const ordersData = await ordersResponse.json();
  assert.equal(ordersResponse.status, 200);
  assert.ok(Array.isArray(ordersData));
  assert.ok(ordersData.some((order) => order.orderId === 'demo-order-123'));
});
