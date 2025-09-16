// Repository 管理器
import { RequestRepository } from './RequestRepository'
import { CollectionRepository } from './CollectionRepository'
import { EnvironmentRepository } from './EnvironmentRepository'
import { HistoryRepository } from './HistoryRepository'
import {
  IRequestRepository,
  ICollectionRepository,
  IEnvironmentRepository,
  IHistoryRepository
} from '../core/types'

class RepositoryManager {
  private static instance: RepositoryManager
  private requestRepo: RequestRepository | null = null
  private collectionRepo: CollectionRepository | null = null
  private environmentRepo: EnvironmentRepository | null = null
  private historyRepo: HistoryRepository | null = null

  private constructor() {}

  static getInstance(): RepositoryManager {
    if (!RepositoryManager.instance) {
      RepositoryManager.instance = new RepositoryManager()
    }
    return RepositoryManager.instance
  }

  get requests(): IRequestRepository {
    if (!this.requestRepo) {
      this.requestRepo = new RequestRepository()
    }
    return this.requestRepo
  }

  get collections(): ICollectionRepository {
    if (!this.collectionRepo) {
      this.collectionRepo = new CollectionRepository()
    }
    return this.collectionRepo
  }

  get environments(): IEnvironmentRepository {
    if (!this.environmentRepo) {
      this.environmentRepo = new EnvironmentRepository()
    }
    return this.environmentRepo
  }

  get history(): IHistoryRepository {
    if (!this.historyRepo) {
      this.historyRepo = new HistoryRepository()
    }
    return this.historyRepo
  }
}

export const repositories = RepositoryManager.getInstance()
export default repositories
