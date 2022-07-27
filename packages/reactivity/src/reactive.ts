import { isObject } from '@vue/shared';

// 1. 将数据转换成响应式数据,只能做对象的代理

const reactiveMap = new WeakMap(); // key只能是对象
const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}


// 1. 实现同一个对象 代理多次,返回同一个代理
// 2. 代理对象被再次代理 可以直接返回
export function reactive(target) {
  if (!isObject(target)) {
    return;
  }

  // 判断是否代理过
  let exisitingProxy = reactiveMap.get(target) 
  if (exisitingProxy) {
    return exisitingProxy;
  }


  //第一次普通对象代理,我们通过new Proxy代理一次
  // 下一次你传递Proxy 我们可以看下他有没有代理过,如果访问这个Proxy有get方法的时候说明就访问过了
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
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
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      return Reflect.get(target, key, receiver)
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    }
  });
  reactiveMap.set(target, proxy);
  return proxy;
}