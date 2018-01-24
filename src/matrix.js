import { Monad, flatMap } from '../src/monad';
import { Functor, map, foldl } from 'funcadelic'

export default class Matrix {
  constructor(data = [[]]) {
    this.data = data;
  }
}

Functor.instance(Matrix, {
  map(fn, matrix) {
    let data = foldl((rows, row, rowIndex) => [...rows, foldl((cells, cell, cellIndex) => [...cells, fn(cell, [rowIndex, cellIndex])], [], row)], [], matrix.data);
    return new Matrix(data);
  }
})

Monad.instance(Matrix, {
  flatMap(fn, matrix) {
    return fn(matrix.data);
  }
})