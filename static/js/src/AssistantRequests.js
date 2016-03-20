import React from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent';

class App extends React.Component {
  constructor (props) {
      super(props);
      this.state = {serviceTypes: []};
  }
  componentDidMount () {
      this.typesRequest = request.get('/api/service-types')
          .end((err, res) => {
              if (err) {
                  toastr.error("Couldn't get service types!");
              }
              else {
                  this.setState({serviceTypes: res.body.data});
              }
          });
            
  }
  componentWillUnmount () {
      this.typesRequest.abort();
  }


  render () {
      console.log(this.state.serviceTypes);
    return (
      <div className="jumbotron">
       
        <p>Assistant Requests</p>
        <p><a className="btn btn-primary btn-lg" href="#" role="button" data-toggle="modal" data-target="#new-request-modal">New Request</a></p>

        <div className="modal fade" id="new-request-modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 className="modal-title" id="myModalLabel">New Assistant Request</h4>
              </div>
              <div className="modal-body">
                <div className="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" name="first_name" id="first_name" className="form-control" placeholder="First Name"/>
                </div>
                <div className="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" name="last_name" id="last_name" className="form-control" placeholder="Last Name"/>
                </div>
                <div className="form-group">
                    <label for="email">Email</label>
                    <input type="text" name="email" id="email" className="form-control" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <label for="service_type">Select Service Type</label>
                    <select className="form-control" name="service_type">
                        { this.state.serviceTypes.map(type => 
                        <option value={type.id} key={type.id}>{type.display_name}</option>)}
                    </select>
                </div>
                <div className="form-group">
                    <label for="description">Assistance request description</label>
                    <textarea name="description" id="description" className="form-control" placeholder="Assistance request description"></textarea>
                </div>
                <div className="checkbox">
                    <label>
                      <input type="checkbox" name="accept"/> I hearby accept the terms of service for THE NETWORK and the Privacy Policy.
                    </label>
                </div>


              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Get Assistance</button>
              </div>
            </div>
          </div>
        </div>

    </div>
    );
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('react-root')
);
