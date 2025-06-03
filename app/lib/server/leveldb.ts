// leveldb-client.js
import { Level, type DatabaseOptions } from "level";

export type LevelClientOptions = {
  debug?: boolean;
} & DatabaseOptions<string, any>;

export class LevelDBClient {
  private db: Level<string, any>;
  private options: LevelClientOptions;

  constructor(dbPath: string, options: LevelClientOptions = {}) {
    const dbOptions = {
      ...options,
      valueEncoding: "json",
    };

    this.db = new Level(dbPath, dbOptions);
    this.options = options;
    this.db
      .open()
      .then(() => {
        this.log("Connected");
      })
      .catch((err) => {
        console.error("Failed to open db", err);
      });
  }

  log(...message: any[]) {
    if (this.options.debug) {
      console.log("[LevelDb]", message);
    }
  }

  async put(key: string, value: any) {
    try {
      this.log(`put [${key}] -> ${value}`);
      await this.db.put(key, value);
      return value;
    } catch (ex) {
      console.error(`Failed to put ${key}`, ex);
      return false;
    }
  }

  async get(key: string) {
    try {
      this.log(`get [${key}]`);
      return await this.db.get(key);
    } catch (ex) {
      console.error(`Failed to get ${key}`, ex);
      return undefined;
    }
  }

  async del(key: string) {
    try {
      this.log(`del [${key}]`);
      return this.db.del(key);
    } catch (ex) {
      console.error(`Failed to del ${key}`, ex);
      return false;
    }
  }

  async *prefix(prefix: string) {
    this.log(`prefix [${prefix}]`);
    const it = this.db.iterator({
      gte: prefix,
      lt: prefix + "\uffff",
    });

    for await (const [key, value] of it) {
      yield [key, value];
    }
  }

  async close() {
    try {
      this.log(`close`);
      return this.db.close();
    } catch (ex) {
      console.error(`Failed to close db`, ex);
    }
  }
}
