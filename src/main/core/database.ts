// 全局数据库单例模块
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { logger } from './logger'

class DatabaseManager {
  private static instance: DatabaseManager
  private db: Database.Database | null = null
  private initialized = false

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  async init(): Promise<void> {
    if (this.initialized) {
      return
    }

    try {
      // 确保用户数据目录存在
      const userDataPath = app.getPath('userData')
      const dbPath = path.join(userDataPath, 'dmapi.db')

      // 创建目录
      const dbDir = path.dirname(dbPath)
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
      }

      // 初始化数据库连接
      this.db = new Database(dbPath, {
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined
      })

      // 启用 WAL 模式以提高并发性能
      this.db.pragma('journal_mode = WAL')

      // 创建表结构
      await this.createTables()

      this.initialized = true
      logger.info('Database initialized successfully')
    } catch (error) {
      logger.error('Database initialization failed:', error)
      throw error
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized')

    // 创建 collections 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        parent_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES collections (id) ON DELETE CASCADE
      )
    `)

    // 创建 requests 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        method TEXT NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS')),
        headers TEXT,
        body TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (collection_id) REFERENCES collections (id) ON DELETE CASCADE
      )
    `)

    // 创建 environments 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS environments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        variables TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // 创建 history 表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        response_status INTEGER,
        response_headers TEXT,
        response_body TEXT,
        response_time INTEGER,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (request_id) REFERENCES requests (id) ON DELETE CASCADE
      )
    `)

    // 创建触发器来自动更新 updated_at
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_collections_updated_at
      AFTER UPDATE ON collections
      BEGIN
        UPDATE collections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_requests_updated_at
      AFTER UPDATE ON requests
      BEGIN
        UPDATE requests SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `)

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_environments_updated_at
      AFTER UPDATE ON environments
      BEGIN
        UPDATE environments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `)
  }

  getDatabase(): Database.Database {
    if (!this.db || !this.initialized) {
      throw new Error('Database not initialized. Call init() first.')
    }
    return this.db
  }

  close(): void {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initialized = false
      logger.info('Database connection closed')
    }
  }

  // 事务执行方法
  transaction<T>(fn: () => T): T {
    if (!this.db) throw new Error('Database not initialized')
    return this.db.transaction(fn)()
  }
}

export const database = DatabaseManager.getInstance()
export default database
