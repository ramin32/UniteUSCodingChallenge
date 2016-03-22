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

  it('partial submit', function () {
    var requestComponent = TestUtils.renderIntoDocument(<AssistanceRequests />);
    var requestForm = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'form');
    var inputFields = TestUtils.scryRenderedDOMComponentsWithTag(requestComponent, 'input');
    inputFields.forEach(function (f) {
        TestUtils.Simulate.change(f, {target: {name: f.name, value: 'test'}});
    });

    TestUtils.Simulate.submit(requestForm);
    var errorFields = TestUtils.scryRenderedDOMComponentsWithClass(requestComponent, 'error-message');
    chai.expect(errorFields.length).to.equal(2);
  });

  function populateAllFields(requestComponent) {
    var inputFields = TestUtils.scryRenderedDOMComponentsWithTag(requestComponent, 'input');
    inputFields.forEach(function (f) {
        if (f.type == "checkbox") {
            TestUtils.Simulate.change(f, {target: {name: f.name, type: "checkbox", checked: true}});
        }
        else {
            TestUtils.Simulate.change(f, {target: {name: f.name, value: "test"}});
        }
    });

    var serviceTypeField = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'select');
    TestUtils.Simulate.change(serviceTypeField, {target: {name: serviceTypeField.name, value: 'benefits'}});

    var descriptionField = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'textarea');
    TestUtils.Simulate.change(descriptionField, {target: {name: descriptionField.name, value: 'some description...'}});

  }

  it('normal submit', function () {
    var requestComponent = TestUtils.renderIntoDocument(<AssistanceRequests />);
    var requestForm = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'form');
    populateAllFields(requestComponent);
    TestUtils.Simulate.submit(requestForm);
    var errorFields = TestUtils.scryRenderedDOMComponentsWithClass(requestComponent, 'error-message');
    chai.expect(errorFields.length).to.equal(0);
  });

  it('check unique submits', function (done) {
    this.timeout(15000);
    var requestComponent = TestUtils.renderIntoDocument(<AssistanceRequests />);
    var requestForm = TestUtils.findRenderedDOMComponentWithTag(requestComponent, 'form');
    populateAllFields(requestComponent);


    requestComponent.setAjaxCompletedCallback(function () {
        TestUtils.Simulate.submit(requestForm);
        if (requestComponent.previousSubmissionPassed()) {
            requestComponent.setAjaxCompletedCallback(function () {
                done();
                requestComponent.setAjaxCompletedCallback(function (){});
                chai.expect(requestComponent.getPreviousErrorMessage()).to.equal('You already made that request');
            });
            TestUtils.Simulate.submit(requestForm);
        }
    });

    TestUtils.Simulate.submit(requestForm);
  });
});
