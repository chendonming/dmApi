import { BaseRepository } from './BaseRepository'
import { CollectionEntity, ICollectionRepository } from '../core/types'

export class CollectionRepository
  extends BaseRepository<CollectionEntity>
  implements ICollectionRepository
{
  constructor() {
    super('collections')
    this.initStatements()
  }

  protected mapRowToEntity(row: Record<string, unknown>): CollectionEntity {
    return {
      id: row.id as number,
      name: row.name as string,
      description: (row.description as string | null) || undefined,
      parent_id: (row.parent_id as number | null) || undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string
    }
  }

  protected mapEntityToRow(entity: Omit<CollectionEntity, 'id' | 'created_at' | 'updated_at'>): {
    name: string
    description: string | null
    parent_id: number | null
  } {
    return {
      name: entity.name,
      description: entity.description || null,
      parent_id: entity.parent_id || null
    }
  }

  protected getInsertColumns(): string {
    return 'name, description, parent_id'
  }

  protected getInsertPlaceholders(): string {
    return '?, ?, ?'
  }

  protected getUpdateSetClause(): string {
    return 'name = ?, description = ?, parent_id = ?'
  }

  // 额外的预处理语句
  private findByParentStmt: Database.Statement | null = null
  private findTreeStmt: Database.Statement | null = null

  protected initStatements(): void {
    super.initStatements()
    this.findByParentStmt = this.db.prepare(`
      SELECT * FROM collections WHERE parent_id IS ? ORDER BY created_at ASC
    `)
    this.findTreeStmt = this.db.prepare(`
      SELECT c1.*, COUNT(c2.id) as child_count
      FROM collections c1
      LEFT JOIN collections c2 ON c1.id = c2.parent_id
      GROUP BY c1.id
      ORDER BY c1.created_at ASC
    `)
  }

  findByParent(parentId?: number): CollectionEntity[] {
    if (!this.findByParentStmt) this.initStatements()
    try {
      const rows = this.findByParentStmt!.all(parentId ?? null) as Array<{
        id: number
        name: string
        description: string | null
        parent_id: number | null
        created_at: string
        updated_at: string
      }>
      return rows.map((row) => this.mapRowToEntity(row))
    } catch (error) {
      logger.error('Error finding collections by parent:', error)
      throw error
    }
  }

  findTree(): CollectionEntity[] {
    if (!this.findTreeStmt) this.initStatements()
    try {
      const rows = this.findTreeStmt!.all() as Array<{
        id: number
        name: string
        description: string | null
        parent_id: number | null
        created_at: string
        updated_at: string
        child_count: number
      }>
      return rows.map(
        (row) =>
          ({
            ...this.mapRowToEntity(row),
            child_count: row.child_count
          }) as CollectionEntity & { child_count: number }
      )
    } catch (error) {
      logger.error('Error finding collection tree:', error)
      throw error
    }
  }
}

import Database from 'better-sqlite3'
import { logger } from '../core/logger'
