/** 最小存储契约：服务不需要知道数据写入内存还是浏览器。 */
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
