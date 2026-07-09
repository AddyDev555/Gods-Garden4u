import { buildCheckoutItems, getOrderItemImage } from './helpers';
import { API_BASE_URL } from './constants';

describe('buildCheckoutItems', () => {
  it('preserves the selected quantity for checkout payloads', () => {
    const items = [
      {
        id: 10,
        product_name: 'Herbal Tea',
        size: 'M',
        quantity: 2,
        offer_price: 120,
        mrp: 150,
      },
    ];

    expect(buildCheckoutItems(items)).toEqual([
      {
        product_pk: 10,
        product_name: 'Herbal Tea',
        name: 'Herbal Tea',
        size: 'M',
        quantity: 2,
        qty: 2,
        offer_price: 120,
        mrp: 150,
        total_price: 240,
      },
    ]);
  });

  it('uses qty when the cart API returns quantity under a different field', () => {
    const items = [
      {
        id: 11,
        name: 'Super Seeds',
        main_image: 'https://cdn.example.com/super-seeds.jpg',
        size: 'L',
        qty: 2,
        offer_price: 180,
        mrp: 200,
      },
    ];

    expect(buildCheckoutItems(items)).toEqual([
      {
        product_pk: 11,
        product_name: 'Super Seeds',
        name: 'Super Seeds',
        image: 'https://cdn.example.com/super-seeds.jpg',
        product_image: 'https://cdn.example.com/super-seeds.jpg',
        thumbnail: 'https://cdn.example.com/super-seeds.jpg',
        main_image: 'https://cdn.example.com/super-seeds.jpg',
        size: 'L',
        quantity: 2,
        qty: 2,
        offer_price: 180,
        mrp: 200,
        total_price: 360,
      },
    ]);
  });

  it('returns the first available image for order items', async () => {
    await expect(getOrderItemImage({ image: 'https://cdn.example.com/one.jpg' })).resolves.toBe('https://cdn.example.com/one.jpg');
    await expect(getOrderItemImage({ product_image: 'https://cdn.example.com/two.jpg' })).resolves.toBe('https://cdn.example.com/two.jpg');
    await expect(getOrderItemImage({ thumbnail: 'https://cdn.example.com/three.jpg' })).resolves.toBe('https://cdn.example.com/three.jpg');
    await expect(getOrderItemImage({ main_image: 'https://cdn.example.com/four.jpg' })).resolves.toBe('https://cdn.example.com/four.jpg');
    await expect(getOrderItemImage({ image: '/media/demo.jpg' })).resolves.toBe(new URL('/media/demo.jpg', API_BASE_URL).toString());
    await expect(getOrderItemImage({})).resolves.toBe('');
  });
});
