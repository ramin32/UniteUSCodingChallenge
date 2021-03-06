'use strict';

import React from 'react';
import ReactDOM from 'react-dom';


const Error = ({errors, name}) => {
    if (errors && errors[name]) {
        return <div className="text-danger pull-right error-message">{errors[name]}</div>;
    }

    return <span/>;
};

export const TextField = ({name, label, data, onChange, errors}) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <input type="text" name={name} value={data[name] || ""} id={name} className="form-control" placeholder={label} onChange={onChange}/>
        <Error errors={errors} name={name}/>
    </div>
);

export const SelectField = ({name, label, data, options, onChange, errors}) => (
    <div className="form-group">
        <label htmlFor="service_type">Select Service Type</label>
        <select className="form-control" value={data[name] || ""} name="service_type" onChange={onChange}>
            <option value="">--</option>
            { options.map(option => 
            <option value={option.id} key={option.id}>{option.display_name}</option>)}
        </select>
        <Error errors={errors} name={name}/>
    </div>
);

export const TextAreaField = ({name, label, data, onChange, errors}) => (
    <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <textarea name={name} id={name} value={data[name] || ""} className="form-control" placeholder={label} onChange={onChange}></textarea>
        <Error errors={errors} name={name}/>
    </div>
);

export const CheckboxField = ({name, label, data, onChange, errors}) => (
    <div className="checkbox">
        <label>
          <input type="checkbox" checked={data[name] || false} name={name} onChange={onChange}/> {label}
        </label>
        <Error errors={errors} name={name}/>
    </div>
);
