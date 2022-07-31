export const DB_PREFIX = {
  CART: `CART_`,
  DISCOUNT: `DISCOUNT_CODE_`,
};

class Database {
  private db: any;
  constructor() {
    this.db = {};
  }

  currentStateOfDB() {
    return this.db;
  }

  getCount(key: string) {
    return Object.keys(this.db).filter((currentKey: string) =>
      currentKey.includes(key)
    ).length;
  }

  getAllMatchingKeys(key: string) {
    return Object.keys(this.db).filter((currentKey) => currentKey.includes(key));
  }

  getAllMatchingValues(key: string) {
    const data = Object.keys(this.db)
      .filter((currentKey) => currentKey.includes(key))
      .map((currentKey) => JSON.parse(this.db[currentKey]));
    return data;
  }

  get(key: string) {
    return this.db[key] ? JSON.parse(this.db[key]) : undefined;
  }

  set(key: string, value: any) {
    this.db[key] = JSON.stringify(value);
  }

  delete(key: string) {
    delete this.db[key];
  }
}

const client = new Database();
export default client;
