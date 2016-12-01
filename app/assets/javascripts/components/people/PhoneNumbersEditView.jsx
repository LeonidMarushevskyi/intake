import Immutable from 'immutable'
import React from 'react'
import PhoneNumberField from 'components/common/PhoneNumberField'

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
            <PhoneNumberField
              phoneNumber={phone_number}
              phoneNumberType={phone_number_type}
              onChange={(field, value) => this.editAddedPhoneNumber([index, field], value)}
            />
            <div className='col-md-2'>
              <button
                className='btn bg-secondary-red c-white'
                onClick={() => this.deletePhoneNumber(index)}
              >
                Delete
              </button>
            </div>
          </div>
        )
      })
    )
  }

  renderNewPhoneNumberSection() {
    const number = this.state.new_phone_number
    const {phone_number, phone_number_type}= number.toJS()
    return (
      <div className='row item bg-gray-lightest double-gap-top pad-top pad-bottom'>
        <PhoneNumberField
          phoneNumber={phone_number}
          phoneNumberType={phone_number_type}
          onChange={(field, value) => this.setField(field, value)}
        />
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
