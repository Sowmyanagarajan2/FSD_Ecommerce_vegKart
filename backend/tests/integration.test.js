const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { app } = require('../server');
require('dotenv').config();

async function runIntegrationTests() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fsd_ecommerce');

  const server = app.listen(0);
  const port = server.address().port;

  const email = `integration_${Date.now()}@example.com`;
  const password = 'Password123!';

  try {
    let response = await fetch(`http://127.0.0.1:${port}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Integration Tester',
        email,
        password,
      }),
    });

    let body = await response.json();
    console.log('signup status:', response.status);
    assert.equal(response.status, 201, 'Signup should succeed');
    assert.equal(body.User.email, email, 'Returned user email should match signup email');

    response = await fetch(`http://127.0.0.1:${port}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    body = await response.json();
    console.log('login status:', response.status);
    assert.equal(response.status, 200, 'Login should succeed');
    assert.ok(body.token, 'JWT token should be present');

    const token = body.token;

    response = await fetch(`http://127.0.0.1:${port}/api/auth/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    body = await response.json();
    console.log('profile status:', response.status);
    assert.equal(response.status, 200, 'Profile request should pass with token');
    assert.equal(body.user.email, email, 'Profile should return the authenticated user');

    response = await fetch(`http://127.0.0.1:${port}/api/payment/save-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          {
            productId: 'product-1',
            prod_name: 'Apple',
            price: 120,
            quantity: 2,
          },
        ],
        amount: 240,
        paymentId: 'integration-payment-1',
        orderId: 'integration-order-1',
      }),
    });

    body = await response.json();
    console.log('save-order status:', response.status);
    assert.equal(response.status, 201, 'Order should be saved');
    assert.equal(body.order.amount, 240, 'Saved order amount should match request');

    response = await fetch(`http://127.0.0.1:${port}/api/payment/my-orders`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const orders = await response.json();
    console.log('my-orders status:', response.status);
    assert.equal(response.status, 200, 'My orders endpoint should respond');
    assert.ok(Array.isArray(orders), 'Orders response should be an array');
    assert.ok(orders.some((order) => order.orderId === 'integration-order-1'), 'Saved order should be returned by my-orders');

    console.log('INTEGRATION_TESTS: PASS');
  } catch (error) {
    console.error('INTEGRATION_TESTS: FAIL');
    console.error(error);
    process.exitCode = 1;
  } finally {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    }).catch(() => {});
    await mongoose.disconnect();
  }
}

runIntegrationTests();
