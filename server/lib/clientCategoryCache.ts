import { getCategories } from '~/server/lib/utils'

const EXPIRE_MILLIS: number = 3 * 60 * 60 * 1000

export class ClientCategoryCache {
  private readonly expirationTime: Date
  private expired: boolean
  private readonly categories: Category[]
  private static instance: ClientCategoryCache | undefined = null
  private static instanceLock = false

  private constructor(categories: Category[]) {
    this.categories = categories
    this.expirationTime = new Date(Date.now() + EXPIRE_MILLIS)
    this.expired = false
  }

  public static async getInstance(onExpireCategorySupplier: () => Promise<Category[]>): Promise<ClientCategoryCache> {
    if (!this.instance || this.instance.isExpired()) {
      if (this.instanceLock) {
        while (!this.instance) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      } else {
        this.instanceLock = true
        this.instance = new ClientCategoryCache(await onExpireCategorySupplier())
        this.instanceLock = false
      }
    }

    return this.instance
  }

  public static async getCustomerCategories(): Promise<Category[]> {
    const current = (await ClientCategoryCache.getInstance(async () => getCategories(true))).getCategories()

    return [...current]
  }

  public static invalidateCustomerCategories() {
    if (this.instance) {
      this.instance.invalidate()
    }
  }

  private isExpired(): boolean {
    if (this.expired) {
      return true
    }

    this.expired = this.expirationTime < new Date()

    return this.expired
  }

  public getCategories() {
    return this.categories
  }

  protected invalidate() {
    this.expired = true
  }
}
