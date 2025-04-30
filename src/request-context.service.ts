import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { AccessTokenPayload } from './common/types';
// tewt vsdf
interface StoreValueMap {
  user: AccessTokenPayload;
}

@Injectable()
export class RequestContextService {
  private readonly asyncLocalStorage = new AsyncLocalStorage<
    Map<keyof StoreValueMap, StoreValueMap[keyof StoreValueMap]>
  >();

  run(callback: (...args: any[]) => void) {
    const store = new Map<
      keyof StoreValueMap,
      StoreValueMap[keyof StoreValueMap]
    >();
    this.asyncLocalStorage.run(store, callback);
  }

  set(key: keyof StoreValueMap, value: StoreValueMap[keyof StoreValueMap]) {
    const store = this.asyncLocalStorage.getStore();

    !!store && store.set(key, value);
  }

  get(key: keyof StoreValueMap) {
    const store = this.asyncLocalStorage.getStore();
    return store?.get(key);
  }
}
