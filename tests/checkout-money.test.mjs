import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';

const testDirectory = path.dirname(fileURLToPath(import.meta.url));

// Run the server helpers without contacting Strapi or Mercado Pago.
function load(file, dependencies = {}, globals = {}) {
  const source = fs.readFileSync(path.resolve(testDirectory, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loadedModule = { exports: {} };
  vm.runInNewContext(outputText, {
    module: loadedModule,
    exports: loadedModule.exports,
    require: (name) => {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`);
      return dependencies[name];
    },
    crypto: globalThis.crypto,
    process: { env: { NODE_ENV: 'test', NEXT_PUBLIC_URL: 'https://store.example' } },
    ...globals,
  });
  return loadedModule.exports;
}

const money = load('app/lib/money.ts');

test('catalog prices convert exactly to cents, including floating-point edge cases', () => {
  for (const [soles, cents] of [[19.9, 1990], [0.29, 29], [1.15, 115], [0.1, 10], [10, 1000], [0, 0], ['19.90', 1990], ['19.9000', 1990]]) {
    assert.equal(money.solesToCents(soles), cents);
  }
  assert.equal(money.solesToCents('90071992547409.91'), Number.MAX_SAFE_INTEGER);
});

test('invalid or unsafe catalog prices are rejected instead of rounded', () => {
  for (const price of [-1, NaN, Infinity, 19.999, 'abc', '1e2', '90071992547409.92']) {
    assert.throws(() => money.solesToCents(price));
  }
});

test('stored cents format as decimal soles without losing precision', () => {
  for (const [cents, soles] of [[1990, '19.90'], ['5970', '59.70'], [29, '0.29'], [1, '0.01'], [0, '0.00'], ['000100', '1.00'], ['9007199254740991', '90071992547409.91']]) {
    assert.equal(money.centsToSoles(cents), soles);
  }
  for (const invalid of [-1, 1.5, NaN, Infinity, '19.90', '', 'abc', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => money.centsToSoles(invalid));
  }
});

function orderHelper(products, onWrite) {
  return load('app/lib/get-or-create-order.ts', {
    './money': money,
    './get-items-for-order': { getItemsForOrder: async () => [null, products] },
    './strapi': {
      queryV2: async (url, method, body) => {
        assert.equal(url, 'orders?populate=items');
        assert.equal(method, 'POST');
        const data = JSON.parse(body).data;
        onWrite(data);
        return [null, { data: {
          ...data,
          documentId: 'strapi-order',
          totalAmount: data.totalAmount.toString(),
          items: data.items.map((item) => ({ ...item, unitPrice: item.unitPrice.toString() })),
        } }];
      },
    },
  }).getOrCreateOrder;
}

const product = (id, price) => ({ id, price, title: `Product ${id}`, slug: `product-${id}`, type: 'DIGITAL', cover: { url: '/cover.png' } });

test('checkout persists integer cents and sends matching totals in soles to Mercado Pago', async () => {
  let storedOrder;
  const getOrCreateOrder = orderHelper([product(1, 19.9), product(2, 0.29)], (data) => { storedOrder = data; });
  const [error, order] = await getOrCreateOrder('buyer@example.test', 'checkout-key', [{ id: 1, quantity: 3 }, { id: 2, quantity: 3 }]);
  assert.equal(error, null);
  assert.equal(storedOrder.subtotalAmount, 6057);
  assert.equal(storedOrder.discountAmount, 0);
  assert.equal(storedOrder.totalAmount, 6057);
  assert.deepEqual(storedOrder.items.map(({ unitPrice, totalPrice }) => ({ unitPrice, totalPrice })), [
    { unitPrice: 1990, totalPrice: 5970 },
    { unitPrice: 29, totalPrice: 87 },
  ]);

  let payload;
  const { createMercadoPagoOrder } = load('app/lib/mercado-pago.ts', {
    './money': money,
    '../interfaces/mercadopago': load('app/interfaces/mercadopago.ts'),
  }, {
    fetch: async (url, options) => {
      assert.equal(url, 'https://api.mercadopago.com/v1/orders');
      assert.equal(options.headers['X-Idempotency-Key'], 'checkout-key');
      payload = JSON.parse(options.body);
      return { ok: true, json: async () => ({ id: 'mp-order', status: 'created', checkout_url: 'https://checkout.example' }) };
    },
  });
  const [paymentError] = await createMercadoPagoOrder('checkout-key', order);
  assert.equal(paymentError, null);
  assert.equal(payload.total_amount, '60.57');
  assert.deepEqual(payload.items.map((item) => item.unit_price), ['19.90', '0.29']);
  assert.equal(payload.external_reference, storedOrder.orderNumber);
});

test('invalid quantities, fractional prices and overflowing totals prevent order writes', async () => {
  const scenarios = [
    { products: [product(1, 19.999)], items: [{ id: 1, quantity: 1 }] },
    ...[0, -1, 1.5, '2', undefined].map((quantity) => ({ products: [product(1, 19.9)], items: [{ id: 1, quantity }] })),
    { products: [product(1, '90071992547409.91')], items: [{ id: 1, quantity: 2 }] },
    { products: [product(1, '45035996273704.96'), product(2, '45035996273704.96')], items: [{ id: 1, quantity: 1 }, { id: 2, quantity: 1 }] },
  ];
  for (const { products, items } of scenarios) {
    let writes = 0;
    const getOrCreateOrder = orderHelper(products, () => { writes++; });
    const [error, order] = await getOrCreateOrder('buyer@example.test', 'checkout-key', items);
    assert.ok(error);
    assert.equal(order, null);
    assert.equal(writes, 0);
  }
});
