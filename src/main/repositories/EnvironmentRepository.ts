import { BaseRepository } from './BaseRepository'
import { EnvironmentEntity, IEnvironmentRepository } from '../core/types'

export class EnvironmentRepository
  extends BaseRepository<EnvironmentEntity>
  implements IEnvironmentRepository
{
  constructor() {
    super('environments')
    this.initStatements()
  }

  protected mapRowToEntity(row: any): EnvironmentEntity {
    return {
      id: row.id,
      name: row.name,
      variables: row.variables,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  protected mapEntityToRow(
    entity: Omit<EnvironmentEntity, 'id' | 'created_at' | 'updated_at'>
  ): any {
    return {
      name: entity.name,
      variables: entity.variables
    }
  }

  protected getInsertColumns(): string {
    return 'name, variables'
  }

  protected getInsertPlaceholders(): string {
    return '?, ?'
  }

  protected getUpdateSetClause(): string {
    return 'name = ?, variables = ?'
  }

  // 额外的预处理语句
  private findActiveStmt: Database.Statement | null = null
  private setActiveStmt: Database.Statement | null = null

  protected initStatements(): void {
    super.initStatements()
    this.findActiveStmt = this.db.prepare(`
      SELECT * FROM environments WHERE is_active = 1 LIMIT 1
    `)
    this.setActiveStmt = this.db.prepare(`
      UPDATE environments SET is_active = CASE WHEN id = ? THEN 1 ELSE 0 END
    `)
  }

  findActive(): EnvironmentEntity | null {
    if (!this.findActiveStmt) this.initStatements()
    try {
      const row = this.findActiveStmt!.get() as any
      return row ? this.mapRowToEntity(row) : null
    } catch (error) {
      logger.error('Error finding active environment:', error)
      throw error
    }
  }

  setActive(id: number): boolean {
    if (!this.setActiveStmt) this.initStatements()
    try {
      const result = this.setActiveStmt!.run(id)
      return result.changes > 0
    } catch (error) {
      logger.error('Error setting active environment:', error)
      throw error
    }
  }

  // 重写 create 方法以处理 is_active
  create(entity: Omit<EnvironmentEntity, 'id' | 'created_at' | 'updated_at'>): EnvironmentEntity {
    return super.create(entity)
  }

  // 重写 update 方法
  update(
    id: number,
    entity: Partial<Omit<EnvironmentEntity, 'id' | 'created_at' | 'updated_at'>>
  ): EnvironmentEntity | null {
    return super.update(id, entity)
  }
}

import Database from 'better-sqlite3'
import { logger } from '../core/logger'
