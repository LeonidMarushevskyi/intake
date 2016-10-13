import React from 'react'

export default class PersonShowPage extends React.Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <div className='card double-gap-top'>
        <div className='card-header'>
          <span>Profile Information</span>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-md-6'>
              <label className='no-gap'>First Name</label>
              <div className='c-gray'></div>
            </div>
            <div className='col-md-6'>
              <label className='no-gap-top-desktop'>Last Name</label>
              <div className='c-gray'></div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Gender</label>
              <div className='c-gray'></div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Date of birth</label>
              <div className='c-gray'></div>
            </div>
            <div className='col-md-6'>
              <label>Social security number</label>
              <div className='c-gray'></div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>Address</label>
              <div className='c-gray'></div>
            </div>
            <div className='col-md-6'>
              <label>City</label>
              <div className='c-gray'></div>
            </div>
          </div>
          <div className='row gap-top'>
            <div className='col-md-6'>
              <label>State</label>
              <div className='c-gray'></div>
            </div>
            <div className='col-md-6'>
              <label>Zip</label>
              <div className='c-gray'></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
