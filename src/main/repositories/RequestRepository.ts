import { BaseRepository } from './BaseRepository'
import { RequestEntity, IRequestRepository } from '../core/types'

export class RequestRepository extends BaseRepository<RequestEntity> implements IRequestRepository {
  constructor() {
    super('requests')
    this.initStatements()
  }

  protected mapRowToEntity(row: Record<string, unknown>): RequestEntity {
    return {
      id: row.id as number,
      name: row.name as string,
      url: row.url as string,
      method: row.method as RequestEntity['method'],
      headers: (row.headers as string | null) || undefined,
      body: (row.body as string | null) || undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string
    }
  }

  protected mapEntityToRow(entity: Omit<RequestEntity, 'id' | 'created_at' | 'updated_at'>): {
    collection_id: number | null
    name: string
    url: string
    method: string
    headers: string | null
    body: string | null
  } {
    return {
      collection_id: (entity as any).collection_id || null,
      name: entity.name,
      url: entity.url,
      method: entity.method,
      headers: entity.headers || null,
      body: entity.body || null
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
      const rows = this.findByCollectionStmt!.all(collectionId) as Array<{
        id: number
        name: string
        url: string
        method: string
        headers: string | null
        body: string | null
        created_at: string
        updated_at: string
      }>
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
      headers: entity.headers || null,
      body: entity.body || null
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
