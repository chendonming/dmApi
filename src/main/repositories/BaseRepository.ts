import Database from 'better-sqlite3'
import { database } from '../core/database'
import { logger } from '../core/logger'

export abstract class BaseRepository<T extends { id: number }> {
  protected db: Database.Database
  protected tableName: string

  constructor(tableName: string) {
    this.db = database.getDatabase()
    this.tableName = tableName
  }

  protected abstract mapRowToEntity(row: Record<string, unknown>): T
  protected abstract mapEntityToRow(
    entity: Omit<T, 'id' | 'created_at' | 'updated_at'>
  ): Record<string, unknown>

  // 预处理的 SQL 语句
  private findByIdStmt: Database.Statement | null = null
  private findAllStmt: Database.Statement | null = null
  private insertStmt: Database.Statement | null = null
  private updateStmt: Database.Statement | null = null
  private deleteStmt: Database.Statement | null = null

  protected initStatements(): void {
    try {
      this.findByIdStmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      this.findAllStmt = this.db.prepare(`SELECT * FROM ${this.tableName}`)
      this.insertStmt = this.db.prepare(`
        INSERT INTO ${this.tableName} (${this.getInsertColumns()})
        VALUES (${this.getInsertPlaceholders()})
      `)
      this.updateStmt = this.db.prepare(`
        UPDATE ${this.tableName}
        SET ${this.getUpdateSetClause()}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `)
      this.deleteStmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
    } catch (error) {
      logger.error(`Failed to prepare statements for ${this.tableName}:`, error)
      throw error
    }
  }

  protected abstract getInsertColumns(): string
  protected abstract getInsertPlaceholders(): string
  protected abstract getUpdateSetClause(): string

  findById(id: number): T | null {
    if (!this.findByIdStmt) this.initStatements()
    try {
      const row = this.findByIdStmt!.get(id) as Record<string, unknown> | undefined
      return row ? this.mapRowToEntity(row) : null
    } catch (error) {
      logger.error(`Error finding ${this.tableName} by id:`, error)
      throw error
    }
  }

  findAll(): T[] {
    if (!this.findAllStmt) this.initStatements()
    try {
      const rows = this.findAllStmt!.all() as Record<string, unknown>[]
      return rows.map((row) => this.mapRowToEntity(row))
    } catch (error) {
      logger.error(`Error finding all ${this.tableName}:`, error)
      throw error
    }
  }

  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): T {
    if (!this.insertStmt) this.initStatements()
    try {
      const row = this.mapEntityToRow(entity)
      // Convert object to array for positional placeholders
      const values = Object.values(row)
      const result = this.insertStmt!.run(values)
      const newEntity = {
        ...entity,
        id: result.lastInsertRowid as number,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as unknown as T
      logger.info(`Created ${this.tableName} with id: ${newEntity.id}`)
      return newEntity
    } catch (error) {
      logger.error(`Error creating ${this.tableName}:`, error)
      throw error
    }
  }

  update(id: number, entity: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): T | null {
    if (!this.updateStmt) this.initStatements()
    try {
      const existing = this.findById(id)
      if (!existing) return null

      const updateData = this.mapEntityToRow(entity as Omit<T, 'id' | 'created_at' | 'updated_at'>)
      const values = [...Object.values(updateData), id]
      this.updateStmt!.run(values)

      const updated = this.findById(id)
      logger.info(`Updated ${this.tableName} with id: ${id}`)
      return updated
    } catch (error) {
      logger.error(`Error updating ${this.tableName}:`, error)
      throw error
    }
  }

  delete(id: number): boolean {
    if (!this.deleteStmt) this.initStatements()
    try {
      const result = this.deleteStmt!.run(id)
      const deleted = result.changes > 0
      if (deleted) {
        logger.info(`Deleted ${this.tableName} with id: ${id}`)
      }
      return deleted
    } catch (error) {
      logger.error(`Error deleting ${this.tableName}:`, error)
      throw error
    }
  }
}
