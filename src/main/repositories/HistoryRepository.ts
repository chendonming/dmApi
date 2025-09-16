import { BaseRepository } from './BaseRepository'
import { HistoryEntity, IHistoryRepository } from '../core/types'

export class HistoryRepository extends BaseRepository<HistoryEntity> implements IHistoryRepository {
  constructor() {
    super('history')
    this.initStatements()
  }

  protected mapRowToEntity(row: Record<string, unknown>): HistoryEntity {
    return {
      id: row.id as number,
      request_id: row.request_id as number,
      response_status: (row.response_status as number | null) || undefined,
      response_headers: (row.response_headers as string | null) || undefined,
      response_body: (row.response_body as string | null) || undefined,
      response_time: (row.response_time as number | null) || undefined,
      executed_at: row.executed_at as string
    }
  }

  protected mapEntityToRow(entity: Omit<HistoryEntity, 'id' | 'executed_at'>): {
    request_id: number
    response_status: number | null
    response_headers: string | null
    response_body: string | null
    response_time: number | null
  } {
    return {
      request_id: entity.request_id,
      response_status: entity.response_status || null,
      response_headers: entity.response_headers || null,
      response_body: entity.response_body || null,
      response_time: entity.response_time || null
    }
  }

  protected getInsertColumns(): string {
    return 'request_id, response_status, response_headers, response_body, response_time'
  }

  protected getInsertPlaceholders(): string {
    return '?, ?, ?, ?, ?'
  }

  protected getUpdateSetClause(): string {
    return 'request_id = ?, response_status = ?, response_headers = ?, response_body = ?, response_time = ?'
  }

  // 额外的预处理语句
  private findByRequestStmt: Database.Statement | null = null
  private findRecentStmt: Database.Statement | null = null

  protected initStatements(): void {
    super.initStatements()
    this.findByRequestStmt = this.db.prepare(`
      SELECT * FROM history WHERE request_id = ? ORDER BY executed_at DESC
    `)
    this.findRecentStmt = this.db.prepare(`
      SELECT h.*, r.name as request_name
      FROM history h
      JOIN requests r ON h.request_id = r.id
      ORDER BY h.executed_at DESC
      LIMIT ?
    `)
  }

  findByRequest(requestId: number): HistoryEntity[] {
    if (!this.findByRequestStmt) this.initStatements()
    try {
      const rows = this.findByRequestStmt!.all(requestId) as Array<{
        id: number
        request_id: number
        response_status: number | null
        response_headers: string | null
        response_body: string | null
        response_time: number | null
        executed_at: string
      }>
      return rows.map((row) => this.mapRowToEntity(row))
    } catch (error) {
      logger.error('Error finding history by request:', error)
      throw error
    }
  }

  findRecent(limit: number): HistoryEntity[] {
    if (!this.findRecentStmt) this.initStatements()
    try {
      const rows = this.findRecentStmt!.all(limit) as Array<{
        id: number
        request_id: number
        response_status: number | null
        response_headers: string | null
        response_body: string | null
        response_time: number | null
        executed_at: string
        request_name: string
      }>
      return rows.map(
        (row) =>
          ({
            ...this.mapRowToEntity(row),
            request_name: row.request_name
          }) as HistoryEntity & { request_name: string }
      )
    } catch (error) {
      logger.error('Error finding recent history:', error)
      throw error
    }
  }

  // 重写 create 方法，不需要 created_at/updated_at 字段
  create(entity: Omit<HistoryEntity, 'id' | 'executed_at'>): HistoryEntity {
    const row = this.mapEntityToRow(entity)
    // 手动执行插入，因为基类期望 created_at/updated_at
    const stmt = this.db.prepare(`
      INSERT INTO history (request_id, response_status, response_headers, response_body, response_time, executed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      row.request_id,
      row.response_status,
      row.response_headers,
      row.response_body,
      row.response_time,
      new Date().toISOString()
    )

    return {
      ...entity,
      id: result.lastInsertRowid as number,
      executed_at: new Date().toISOString()
    }
  }
}

import Database from 'better-sqlite3'
import { logger } from '../core/logger'
