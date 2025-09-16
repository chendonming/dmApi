// 数据实体类型定义

export interface RequestEntity {
  id: number
  name: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'
  headers?: string // JSON string
  body?: string
  created_at: string
  updated_at: string
}

export interface CollectionEntity {
  id: number
  name: string
  description?: string
  parent_id?: number
  created_at: string
  updated_at: string
}

export interface EnvironmentEntity {
  id: number
  name: string
  variables: string // JSON string of key-value pairs
  created_at: string
  updated_at: string
}

export interface HistoryEntity {
  id: number
  request_id: number
  response_status?: number
  response_headers?: string
  response_body?: string
  response_time?: number
  executed_at: string
  created_at: string
  updated_at: string
}

// Repository 接口定义
export interface IRepository<T> {
  findById(id: number): T | null
  findAll(): T[]
  create(entity: Omit<T, 'id' | 'created_at' | 'updated_at'>): T
  update(id: number, entity: Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>): T | null
  delete(id: number): boolean
}

export interface IRequestRepository extends IRepository<RequestEntity> {
  findByCollection(collectionId: number): RequestEntity[]
}

export interface ICollectionRepository extends IRepository<CollectionEntity> {
  findByParent(parentId?: number): CollectionEntity[]
  findTree(): CollectionEntity[]
}

export interface IEnvironmentRepository extends IRepository<EnvironmentEntity> {
  findActive(): EnvironmentEntity | null
  setActive(id: number): boolean
}

export interface IHistoryRepository extends IRepository<HistoryEntity> {
  findByRequest(requestId: number): HistoryEntity[]
  findRecent(limit: number): HistoryEntity[]
}
