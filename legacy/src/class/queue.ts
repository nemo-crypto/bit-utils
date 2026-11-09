// TIP: ctrl+cmd+t,生成函数注释
import { debugLog } from '../utils/index';

export class ConcurrentPoll {
  /** 任务队列 */
  tasks: any[] = [];
  /** 最大并发数 */
  max = 0;
  total = 0;
  delay = 0;
  done: () => void;

  constructor({ max = 5, done, delay = 0 }) {
    this.tasks = [];
    this.total = 0;
    this.max = max;
    this.done = done;
    this.delay = delay;
    setTimeout(() => {
      /** 函数主体执行完后立即执行 */
      this.run();
    }, 0);
  }

  addTask(task) {
    this.tasks.push(task);
    this.total += 1;
  }

  run() {
    /** 原型任务运行方法 */
    if (this.tasks.length === 0) {
      /** 判断是否还有任务 */
      return Promise.resolve('');
    }

    /** 取任务个数与最大并发数最小值 */
    const min = Math.min(this.tasks.length, this.max);

    for (let i = 0; i < min; i += 1) {
      /** 执行最大并发递减 */
      this.max -= 1;
      /** 从数组头部取任务 */
      const task = this.tasks.shift();
      task()
        .then(() => {
          // 重：此时可理解为，当for循环执行完毕后异步请求执行回调,此时max变为0
        })
        .catch((error) => {
          debugLog('error', error);
        })
        .finally(() => {
          /** 重：当所有请求完成并返回结果后，执行finally回调，此回调将按照for循环依次执行，此时max为0. */
          setTimeout(() => {
            /** 超过最大并发10以后的任务将按照任务顺序依次执行。此处可理解为递归操作。 */
            this.max += 1;
            this.total -= 1;
            this.run();
            if (this.total === 0) {
              this.done?.();
            }
          }, this.delay);
        });
    }
  }
}
