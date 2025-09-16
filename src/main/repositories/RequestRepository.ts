import { BaseRepository } from './BaseRepository'
import { RequestEntity, IRequestRepository } from '../core/types'

export class RequestRepository extends BaseRepository<RequestEntity> implements IRequestRepository {
  constructor() {
    super('requests')
    this.initStatements()
  }

  protected mapRowToEntity(row: any): RequestEntity {
    return {
      id: row.id,
      name: row.name,
      url: row.url,
      method: row.method,
      headers: row.headers,
      body: row.body,
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  protected mapEntityToRow(entity: Omit<RequestEntity, 'id' | 'created_at' | 'updated_at'>): any {
    return {
      collection_id: (entity as any).collection_id,
      name: entity.name,
      url: entity.url,
      method: entity.method,
      headers: entity.headers,
      body: entity.body
    }
  }

  protected getInsertColumns(): string {
    return 'collection_id, name, url, method, headers, body'
  }

  protected getInsertPlaceholders(): string {
    return '?, ?, ?, ?, ?, ?'
  }

  protected getUpdateSetClause(): string {
    return 'collection_id = ?, name = ?, url = ?, method = ?, headers = ?, body = ?'
  }

  // 额外的预处理语句
  private findByCollectionStmt: Database.Statement | null = null

  protected initStatements(): void {
    super.initStatements()
    this.findByCollectionStmt = this.db.prepare(`
      SELECT * FROM requests WHERE collection_id = ? ORDER BY created_at DESC
    `)
  }

  findByCollection(collectionId: number): RequestEntity[] {
    if (!this.findByCollectionStmt) this.initStatements()
    try {
      const rows = this.findByCollectionStmt!.all(collectionId) as any[]
      return rows.map((row) => this.mapRowToEntity(row))
    } catch (error) {
      logger.error('Error finding requests by collection:', error)
      throw error
    }
  }

  // 重写 create 方法以包含 collection_id
  create(
    entity: Omit<RequestEntity, 'id' | 'created_at' | 'updated_at'> & { collection_id: number }
  ): RequestEntity {
    const row = {
      collection_id: entity.collection_id,
      name: entity.name,
      url: entity.url,
      method: entity.method,
      headers: entity.headers,
      body: entity.body
    }
    return super.create(row as any)
  }

  // 重写 update 方法
  update(
    id: number,
    entity: Partial<
      Omit<RequestEntity, 'id' | 'created_at' | 'updated_at'> & { collection_id?: number }
    >
  ): RequestEntity | null {
    return super.update(id, entity)
  }
}

import Database from 'better-sqlite3'
import { logger } from '../core/logger'
