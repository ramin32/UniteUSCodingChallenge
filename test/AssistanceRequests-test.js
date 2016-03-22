import testdom from './testdom.js';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import AssistanceRequests from '../static/js/src/AssistanceRequests';
import chai from 'chai';

describe('AssistanceRequests', function () {
  it('empty submit', function () {
    var requestComponent = TestUtils.renderIntoDocument(<AssistanceRequests />);
    var requestForm = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'form');
    TestUtils.Simulate.submit(requestForm);
    var errorFields = TestUtils.scryRenderedDOMComponentsWithClass(requestComponent, 'error-message');
    chai.expect(errorFields.length).to.equal(6);
  });
});
