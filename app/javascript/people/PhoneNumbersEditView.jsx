import Immutable from 'immutable'
import PhoneNumberField from 'common/PhoneNumberField'
import PropTypes from 'prop-types'
import React from 'react'

const PhoneNumbersEditView = ({onChange, phoneNumbers}) => {
  const addPhoneNumber = () => {
    const newPhoneNumber = Immutable.Map({number: null, type: null})
    onChange(phoneNumbers.push(newPhoneNumber))
  }

  const editPhoneNumber = (fieldSeq, value) => (
    onChange(phoneNumbers.setIn(fieldSeq, value))
  )

  const deletePhoneNumber = (index) => (
    onChange(phoneNumbers.delete(index))
  )

  return (
    <div>
      {
        phoneNumbers.map((numbers, index) => {
          const {number, type} = numbers.toJS()
          return (
            <div key={index} className='row list-item'>
              <PhoneNumberField
                Number={number || ''}
                Type={type || ''}
                onChange={(field, value) => editPhoneNumber([index, field], value)}
              />
              <a className='list-item__a'
                aria-label='Delete phone number'
                href='#'
                onClick={(event) => {
                  event.preventDefault()
                  deletePhoneNumber(index)
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
            onClick={addPhoneNumber}
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

PhoneNumbersEditView.propTypes = {
  onChange: PropTypes.func.isRequired,
  phoneNumbers: PropTypes.object.isRequired,
}
export default PhoneNumbersEditView
