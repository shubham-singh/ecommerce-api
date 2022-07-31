class Database {
  private db: any;
  constructor() {
    this.db = {};
  }

  currentStateOfDB() {
    return this.db;
  }

  get(key: string) {
    return this.db[key] ? JSON.parse(this.db[key]) : undefined;
  }

  set(key: string, value: any) {
    this.db[key] = JSON.stringify(value);
  }

  delete(key: string) {
    delete this.db[key]
  }
}

const client = new Database();
export default client;

export const DB_PREFIX = {
  CART: `CART_`
}
