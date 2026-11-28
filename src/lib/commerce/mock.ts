/**
 * Mock provider — reads individual JSON files from src/data/products/ and
 * src/data/collections/. Pages CMS edits these files via GitHub.
 */
import type { CommerceProvider, Product, Collection, CartLine } from './types';

const withBase = (path: string) => import.meta.env.BASE_URL.replace(/\/?$/, '/') + path.replace(/^\/+/, '');

const productFiles = import.meta.glob<Product>('../../data/products/*.json', { eager: true, import: 'default' });
const collectionFiles = import.meta.glob<Collection>('../../data/collections/*.json', { eager: true, import: 'default' });

const products = Object.values(productFiles).map((product) => ({
  ...product,
  images: product.images.map((image) => ({ ...image, src: withBase(image.src) })),
}));

const collections = Object.values(collectionFiles).map((collection) => ({
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
    return withBase('/connect-a-backend');
  },
};
