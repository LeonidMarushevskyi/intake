import Immutable from 'immutable'
import React from 'react'
import AddressField from 'components/common/AddressField'

export class AddressEditView extends React.Component {
  constructor() {
    super(...arguments)
    this.addAddress = this.addAddress.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.deleteAddress = this.deleteAddress.bind(this)
  }

  addAddress(){
    const new_address = Immutable.Map({
      street_address: '',
      city: '',
      state: '',
      zip: '',
      type: ''
    })
    const newaddresses = this.props.addresses.push(new_address)
    this.props.onChange(newaddresses)
  }

  editAddress(fieldSeq, value) {
    const {addresses} = this.props
    const newaddresses = addresses.setIn(fieldSeq, value)
    this.props.onChange(newaddresses)

  }

  deleteAddress(index){
    const {addresses} = this.props
    const newaddresses = addresses.delete(index)
    this.props.onChange(newaddresses)
  }

  render() {
    const {addresses} = this.props
    return (
      <div id='addresses'>
        {
          addresses.map((area, index) => {
            const {street_address, city, state, zip, type}= area.toJS()
            return (
              <div key={index} className='row list-item'>
                <AddressField
                  streetAddress={street_address}
                  city={city}
                  state={state}
                  zip={zip}
                  type={type}
                  onChange={(field, value) => this.editAddress([index, field], value)}
                />
                <a className='list-item__a'
                  aria-label='Delete address'
                  href='#'
                  onClick={(event) => {
                    event.preventDefault()
                    this.deleteAddress(index)
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
              onClick={this.addAddress}
              aria-label='Add address'
            >
              <i className="fa fa-plus" />
              <span> Add new address</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

AddressEditView.propTypes = {
  addresses: React.PropTypes.object.isRequired,
  onChange: React.PropTypes.func.isRequired,
}
