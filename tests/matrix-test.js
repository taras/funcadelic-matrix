import { describe, it } from '@bigtest/mocha';
import { expect } from 'chai';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Matrix from '../src/matrix';
import { flatMap } from '../src/monad';
import chain from '../src/chain';

import { map } from 'funcadelic';
import $ from 'jquery';

function withRender(component) {
  function mount(component) {
    let rootElement = document.createElement('div');
    rootElement.id = 'react-testing';
    document.body.appendChild(rootElement);
  
    render(component, rootElement);
  
    return function unmount() {
      unmountComponentAtNode(rootElement);
      document.body.removeChild(rootElement);
    };
  }
  
  let unmount;

  beforeEach(function() {
    unmount = mount(component);
  });
  afterEach(function() {
    unmount();
  });
}

describe('matrix', function() {
  let m = new Matrix([['a', 'b', 'c'], [1, 2, 3]]);
  
  it('stores data', function() {
    expect(m).to.deep.equal({
      data: [['a', 'b', 'c'], [1, 2, 3]]
    })
  });

  describe('map', function() {
    let values = map(v => `${v}`.toUpperCase(), m);
    let indexes = map((v, index) => index, m);
    it('returns an instance of Matrix', function() {
      expect(values).to.be.instanceOf(Matrix);
    });
    it('applies function to each value', function() {
      expect(values).to.deep.equal({
        data: [['A', 'B', 'C'], ['1', '2', '3']]
      })
    });
    it('provides an index for each cell', function() {
      expect(indexes).to.deep.equal({
        data: [[[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]]]
      })
    });
  });

  describe('render to components', function() {
    let table = new Matrix([['a', 'b', 'c'], [1, 2, 3], [4, 5, 6]]);

    const Cell = props => <props.tagName>{props.children}</props.tagName>
    const Row = props => <tr>{props.children}</tr>
    const Table = props => <table><tbody>{props.children}</tbody></table>

    withRender(
      <Table>
        {
          chain(table)
            .map((value, [row]) => row === 0 ? value.toUpperCase() : value)
            .map((value, [row]) => row === 0 ? { tagName: 'th', value } : { tagName: 'td', value })
            .map((cell, [row, index]) => <Cell key={index} tagName={cell.tagName}>{cell.value}</Cell>)
            .flatMap(rows => rows)
            .map((row, index) => <Row key={index}>{row}</Row>)
            .valueOf()
        }
      </Table>
    )

    it('rendered the table', function() {
      expect($('table').length).to.equal(1);
    });
    it('rendered heading cells', function() {
      expect($('th').length).to.equal(3);
      expect($('th').text()).to.equal('ABC');
    });
    it('rendered cells', function() {
      expect($('td').length).to.equal(6)
      expect($('td').text()).to.equal('123456');
    });
  });
});