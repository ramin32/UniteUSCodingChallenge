'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import superagent from 'superagent';
import _ from 'lodash';
import {TextField, SelectField, TextAreaField, CheckboxField} from './FormFields.js';

export default class AssistanceRequests extends React.Component {
  constructor (props) {
      super(props);
      this.state = {
          serviceTypes: [],
          request: {},
          errors: {},
          previousSubmissionPassed: null
      };

      this.ajaxCompletedCallback = function () {};
  }

  setAjaxCompletedCallback(fn) {
      this.ajaxCompletedCallback = fn;
  }
  componentDidMount () {
      this.typesAjaxRequest = superagent.get('http://localhost:5000/api/service-types')
          .end((err, res) => {
              if (err) {
                  toastr.error("Couldn't get service types!");
                  this.ajaxCompletedCallback();
              }
              else {
                  this.setState({serviceTypes: res.body.data}, this.ajaxCompletedCallback);
              }
          });
            
  }
  componentWillUnmount () {
      if (this.typesAjaxRequest) this.typesAjaxRequest.abort();
      if (this.assistanceAjaxRequest) this.assistanceAjaxRequest.abort();
  }

  requestExists(newRequest) {
      var savedRequests = JSON.parse(window.localStorage.getItem('savedRequests') || '[]');
      return savedRequests.reduce(function (found, oldRequest) {
          return found || _.isEqual(newRequest, oldRequest);
      }, false);
  }

  persistRequest(newRequest) {
      var savedRequests = JSON.parse(window.localStorage.getItem('savedRequests') || '[]');
      savedRequests.push(newRequest);
      localStorage.setItem('savedRequests', JSON.stringify(savedRequests));
  }

  previousSubmissionPassed () {
      return this.state.previousSubmissionPassed;
  }

  getPreviousErrorMessage() { 
      return this.previousErrorMessage || "";
  }

  onSubmit (e) {
      e.preventDefault();
      var request = this.state.request || {};
      var errors = {};
      ["first_name", "last_name", "email", "service_type", "description", "accept"].forEach(function (field) {
          if (!request[field]) {
              errors[field] = "required";
          }
      });

      this.setState({errors: errors});

      if (_.isEmpty(errors)) {
          if (this.requestExists(request)) {
              toastr.warning('You already made that request');
              this.previousErrorMessage = 'You already made that request';
              return;
          }
          
          var data = {
              contact: _.pick(this.state.request, ['first_name', 'last_name', 'email'])
          };
          data = _.merge(data, _.pick(this.state.request, ['service_type', 'description', 'accept']));

          this.assistanceAjaxRequest = superagent.post('http://localhost:5000/api/assistance-requests')
                .send(data)
                .end((err, res) => {
                    if (err) {
                        toastr.error(res.body.message);
                        this.setState({previousSubmissionPassed: false}, this.ajaxCompletedCallback);
                    }
                    else {
                        toastr.success('Your request has been successfully submitted!');
                        this.setState({request:{}, error: {}, previousSubmissionPassed: true}, this.ajaxCompletedCallback);
                        $('#new-request-modal').modal('hide');
                        this.persistRequest(request);
                    }
                    this.ajaxCompletedCallback();
                });
          
      }
      else {
          toastr.warning('Please enter the required fields.');
      }


  }

  updateRequest(e) {
      var request = this.state.request || {};
      if (e.target.type === "checkbox") {
          request[e.target.name] = e.target.checked;
      }
      else {
          request[e.target.name] = _.trim(e.target.value);
      }
      this.setState({request: request});
  }

  render () {
    return (
      <div className="jumbotron">
       
        <p>Assistant Requests</p>
        <p><a className="btn btn-primary btn-lg new-request-button" data-toggle="modal" data-target="#new-request-modal">New Request</a></p>

        <form className="modal fade" id="new-request-modal" onSubmit={(e) => this.onSubmit(e)} tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel">New Assistant Request</h4>
              </div>
              <div className="modal-body">
                <TextField name="first_name" 
                           label="First Name" 
                           onChange={this.updateRequest.bind(this)} 
                           errors={this.state.errors}
                           data={this.state.request}
                            />
                <TextField name="last_name" 
                           label="Last Name" 
                           onChange={this.updateRequest.bind(this)}
                           errors={this.state.errors}
                           data={this.state.request}
                            />
                <TextField name="email" 
                           label="Email" 
                           onChange={this.updateRequest.bind(this)}
                           errors={this.state.errors}
                           data={this.state.request}
                            />
                <SelectField name="service_type" 
                             options={this.state.serviceTypes} 
                             onChange={this.updateRequest.bind(this)} 
                             errors={this.state.errors}
                             data={this.state.request}
                              />
                <TextAreaField name="description" 
                               label="Assistance request description" 
                               onChange={this.updateRequest.bind(this)}
                               errors={this.state.errors}
                               data={this.state.request}
                                />
                <CheckboxField name="accept" 
                               label="I hearby accept the terms of service for THE NETWORK and the Privacy Policy."
                               onChange={this.updateRequest.bind(this)}
                               errors={this.state.errors}
                               data={this.state.request}
                                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Get Assistance</button>
              </div>
            </div>
          </div>
        </form>

    </div>
    );
  }
}

