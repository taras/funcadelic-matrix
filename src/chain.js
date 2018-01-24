import { map } from 'funcadelic';
import { flatMap } from './monad';

class Chain {
  constructor(value) {
    Object.defineProperty(this, 'valueOf', {
      value() {
        return value;
      },
    });
  }
  flatMap(fn) {
    return new Chain(flatMap(fn, this.valueOf()));
  }
  map(fn) {
    return new Chain(map(fn, this.valueOf()));
  }
}

export default function chain(value) {
  return new Chain(value);
}