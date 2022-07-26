import { isObject } from '@vue/shared';

// 1. 将数据转换成响应式数据,只能做对象的代理
export function reactive(target) {
  if (!isObject(target)) {
    return;
  }

  // 并没有重新定义属性,只是代理,在取值的时候调用get,当赋值的时候调用set
  const proxy = new Proxy(target, {
    /**
     * @param target 元对象
     * @param key 键
     * @param receiver 代理对象 --> proxy
     * @returns 
     */
    get(target, key, receiver) {
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    }
  });
  return proxy;
}