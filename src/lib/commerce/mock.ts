/**
 * Mock provider — the theme works out of the box with this catalog,
 * no keys, no accounts. Swap via COMMERCE_PROVIDER env (see index.ts).
 */
import type { CommerceProvider, Product, Collection, CartLine } from './types';
import catalog from '../../data/mock-catalog.json';

const withBase = (path: string) => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\/+/, '');

const products = (catalog.products as unknown as Product[]).map((product) => ({
  ...product,
  images: product.images.map((image) => ({ ...image, src: withBase(image.src) })),
}));
const collections = (catalog.collections as unknown as Collection[]).map((collection) => ({
  ...collection,
  image: collection.image && { ...collection.image, src: withBase(collection.image.src) },
}));

export const mockProvider: CommerceProvider = {
  async listProducts(opts = {}) {
    let out = products;
    if (opts.collection) {
      out = out.filter((p) => p.collectionHandles.includes(opts.collection!));
    }
    return opts.limit ? out.slice(0, opts.limit) : out;
  },

  async getProduct(handle) {
    return products.find((p) => p.handle === handle) ?? null;
  },

  async listCollections() {
    return collections;
  },

  async getCollection(handle) {
    return collections.find((c) => c.handle === handle) ?? null;
  },

  async checkoutUrl(_lines: CartLine[]) {
    // Mock mode has no real checkout — point at the docs explaining how to
    // connect Shopify (two env vars) instead.
    return withBase('/connect-a-backend');
  },
};
