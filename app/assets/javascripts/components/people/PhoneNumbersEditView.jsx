import Immutable from 'immutable'
import PHONE_NUMBER_TYPE from 'PhoneNumberType'
import React from 'react'

export class PhoneNumbersEditView extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      new_phone_number: Immutable.Map({
        phone_number: '',
        phone_number_type: '',
      })
    }

    this.addPhoneNumber = this.addPhoneNumber.bind(this)
    this.editAddedPhoneNumber = this.editAddedPhoneNumber.bind(this)
    this.deletePhoneNumber = this.deletePhoneNumber.bind(this)
    this.setField = this.setField.bind(this)
  }

  setField(fieldSeq, value) {
    const new_phone_number = this.state.new_phone_number.set(fieldSeq, value)
    this.setState({new_phone_number: new_phone_number})
  }

  addPhoneNumber() {
    const {new_phone_number} = this.state
    const newPhoneNumbers = this.props.phoneNumbers.push(Immutable.Map(new_phone_number))
    this.props.onChange(newPhoneNumbers)
    this.setState({
      new_phone_number: Immutable.Map({
        phone_number: '',
        phone_number_type: ''
      })
    })
  }

  editAddedPhoneNumber(fieldSeq, value) {
    const {phoneNumbers} = this.props
    const newPhoneNumbers = phoneNumbers.setIn(fieldSeq, value)
    this.props.onChange(newPhoneNumbers)
  }

  deletePhoneNumber(index) {
    const {phoneNumbers} = this.props
    const newPhoneNumbers = phoneNumbers.delete(index)
    this.props.onChange(newPhoneNumbers)
  }

  renderAddedPhoneNumbersSection() {
    const {phoneNumbers} = this.props
    return (
      phoneNumbers.map((number, index) => {
        const {phone_number, phone_number_type}= number.toJS()
        return (
          <div key={index} className='row item bg-gray-lightest double-gap-top pad-top pad-bottom'>
            <div className='col-md-6'>
              <label className='no-gap' htmlFor='phone_number'>Phone Number</label>
              <input
                id='phone_number'
                type='tel'
                placeholder='Ex: 910-435-3223'
                value={phone_number || ''}
                onChange={(event) => this.editAddedPhoneNumber([index, 'phone_number'], event.target.value)}
              />
            </div>
            <div className='col-md-4'>
              <label className='no-gap' htmlFor='phone_number_type'>Phone Number Type</label>
              <select
                id='phone_number_type'
                value={phone_number_type || ''}
                onChange={(event) => this.editAddedPhoneNumber([index, 'phone_number_type'], event.target.value)}
              >
                <option key='' value=''></option>
                {
                  Object.keys(PHONE_NUMBER_TYPE).map((item) =>
                    <option key={item} value={item}>{PHONE_NUMBER_TYPE[item]}</option>
                    )
                }
              </select>
            </div>
            <div className='col-md-2'>
              <button
                className='btn bg-secondary-red c-white'
                onClick={() => this.deletePhoneNumber(index)}
              >Delete</button>
            </div>
          </div>
        )
      })
    )
  }

  renderNewPhoneNumberSection() {
    const number = this.state.new_phone_number
    const phone_number = number.get('phone_number')
    const phone_number_type = number.get('phone_number_type')
    return (
      <div className='row item bg-gray-lightest double-gap-top pad-top pad-bottom'>
        <div className='col-md-6'>
          <label className='no-gap' htmlFor='phone_number'>Phone Number</label>
          <input
            id='phone_number'
            type='tel'
            placeholder='Ex: 910-435-3223'
            value={phone_number || ''}
            onChange={(event) => this.setField('phone_number', event.target.value)}
          />
        </div>
        <div className='col-md-4'>
          <label className='no-gap' htmlFor='phone_number_type'>Phone Number Type</label>
          <select
            id='phone_number_type'
            value={phone_number_type || ''}
            onChange={(event) => this.setField('phone_number_type', event.target.value)}
          >
            <option key='' value=''></option>
            {
              Object.keys(PHONE_NUMBER_TYPE).map((item) =>
                <option key={item} value={item}>{PHONE_NUMBER_TYPE[item]}</option>
              )
            }
          </select>
        </div>
        <div className='col-md-2'>
          <button className='btn bg-gray-dark c-white' onClick={this.addPhoneNumber}>Add</button>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div>
        <div id='added_phone_numbers'>{this.renderAddedPhoneNumbersSection()}</div>
        <div id='new_phone_number'>{this.renderNewPhoneNumberSection()}</div>
      </div>
    )
  }
}

PhoneNumbersEditView.propTypes = {
  phoneNumbers: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
