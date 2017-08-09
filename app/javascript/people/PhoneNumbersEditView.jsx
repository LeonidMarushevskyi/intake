import Immutable from 'immutable'
import PhoneNumberField from 'common/PhoneNumberField'
import PropTypes from 'prop-types'
import React from 'react'


export default class PhoneNumbersEditView extends React.Component {
  constructor() {
    super(...arguments)
    this.addPhoneNumber = this.addPhoneNumber.bind(this)
    this.editPhoneNumber = this.editPhoneNumber.bind(this)
    this.deletePhoneNumber = this.deletePhoneNumber.bind(this)
  }

  addPhoneNumber() {
    const newPhoneNumber = Immutable.Map({number: null, type: null})
    const phoneNumbers = this.props.phoneNumbers.push(newPhoneNumber)
    this.props.onChange(phoneNumbers)
  }

  editPhoneNumber(fieldSeq, value) {
    const phoneNumbers = this.props.phoneNumbers.setIn(fieldSeq, value)
    this.props.onChange(phoneNumbers)
  }

  deletePhoneNumber(index) {
    const phoneNumbers = this.props.phoneNumbers.delete(index)
    this.props.onChange(phoneNumbers)
  }

  render() {
    const {phoneNumbers} = this.props
    return (
      <div id='phone-numbers'>
        {
          phoneNumbers.map((numbers, index) => {
            const {number, type} = numbers.toJS()
            return (
              <div key={index} className='row list-item'>
                <PhoneNumberField
                  Number={number || ''}
                  Type={type || ''}
                  onChange={(field, value) => this.editPhoneNumber([index, field], value)}
                />
                <a className='list-item__a'
                  aria-label='Delete phone number'
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    this.deletePhoneNumber(index)
                  }}
                >
                  <i className='fa fa-times' />
                </a>
              </div>
              )
          })
        }
        <div className='row'>
          <div className='col-md-12'>
            <button
              className='btn btn-default btn-block'
              onClick={this.addPhoneNumber}
              aria-label='Add new phone number'
            >
              <i className='fa fa-plus' />
              <span> Add new phone number</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

PhoneNumbersEditView.propTypes = {
  onChange: PropTypes.func.isRequired,
  phoneNumbers: PropTypes.object.isRequired,
}
