import React from 'react'
import PropTypes from 'prop-types'
import MaskedInputField from 'common/MaskedInputField'
import SelectField from 'common/SelectField'

const PhoneNumbersForm = ({addPhone, deletePhone, onChange, phoneNumbers, phoneTypes}) => (
  <div>
    {phoneNumbers.map(({number, type}, index) => (
      <div className='row list-item' key={index}>
        <MaskedInputField
          gridClassName='col-md-6'
          id={`number-${index}`}
          label='Phone Number'
          mask='(111)111-1111'
          placeholder='(___)___-____'
          maxLength='13'
          type='tel'
          onChange={({target: {value}}) => onChange(index, 'number', value)}
          value={number}
        />
        <SelectField
          gridClassName='col-md-6'
          id={`type-${index}`}
          label='Phone Number Type'
          onChange={({target: {value}}) => onChange(index, 'type', value)}
          value={type}
        >
          <option key='' />
          {phoneTypes.map(({value, label}) => <option key={value} value={value}>{label}</option>)}
        </SelectField>
        <a
          className='list-item__a'
          aria-label='Delete phone number'
          href='#'
          onClick={(event) => {
            event.preventDefault()
            deletePhone(index)
          }}
        >
          <i className='fa fa-times'/>
        </a>
      </div>
    ))}
    <div className='row'>
      <div className='col-md-12'>
        <button
          className='btn btn-default btn-block'
          onClick={addPhone}
          aria-label='Add new phone number'
        >
          <i className='fa fa-plus' />
          <span> Add new phone number</span>
        </button>
      </div>
    </div>
  </div>
)

PhoneNumbersForm.propTypes = {
  addPhone: PropTypes.func,
  deletePhone: PropTypes.func,
  onChange: PropTypes.func,
  phoneNumbers: PropTypes.arrayOf(PropTypes.shape({
    number: PropTypes.string,
    type: PropTypes.string,
  })),
  phoneTypes: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
}

export default PhoneNumbersForm
