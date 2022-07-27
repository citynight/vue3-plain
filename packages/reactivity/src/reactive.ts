import { isObject } from '@vue/shared';
import { mutableHandlers, ReactiveFlags } from './baseHandler'

// 1. 将数据转换成响应式数据,只能做对象的代理
const reactiveMap = new WeakMap(); // key只能是对象


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
  const proxy = new Proxy(target, mutableHandlers);
  reactiveMap.set(target, proxy);
  return proxy;
}