import {getCategories} from "~/server/lib/utils";

const EXPIRE_MILLIS : number = 3 * 60 * 60 * 1000;
export class ClientCategoryCache {
  private readonly expirationTime: Date;
  private expired: boolean;
  private readonly categories: Category[];
  private static instance: ClientCategoryCache;

  constructor(categories : Category[]) {
    this.categories = categories;
    this.expirationTime = new Date(Date.now() + EXPIRE_MILLIS);
    this.expired = false;
  }

  static getInstance = async (onExpireCategorySupplier: () => Promise<Category[]>) => {
    if (!this.instance || this.instance.isExpired()) {
      this.instance = new ClientCategoryCache(await onExpireCategorySupplier());
    }
    return this.instance;
  }

  public static getCustomerCategories = async () => {
    const current = (await ClientCategoryCache
      .getInstance(() => getCategories(true)))
      .getCategories();
    return [...current];
  }

  public static invalidateCustomerCategories () {
    this.instance?.invalidate();
  }

  private isExpired(): boolean {
    if (this.expired) {
      return true;
    }
    this.expired = this.expirationTime < new Date();
    return this.expired;
  }

  public getCategories() {
    return this.categories;
  }

  protected invalidate() {
    this.expired = true;
  }

}
