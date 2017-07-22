import AddressEditView from 'common/AddressEditView'
import Immutable from 'immutable'
import PropTypes from 'prop-types'
import React from 'react'

export default class AddressesEditView extends React.Component {
  constructor() {
    super(...arguments)
    this.addAddress = this.addAddress.bind(this)
    this.editAddress = this.editAddress.bind(this)
    this.deleteAddress = this.deleteAddress.bind(this)
  }

  addAddress() {
    const newAddress = Immutable.Map({
      street_address: null,
      city: null,
      state: null,
      zip: null,
      type: null,
    })
    const addresses = this.props.addresses.push(newAddress)
    this.props.onChange(addresses)
  }

  editAddress(fieldSeq, value) {
    const addresses = this.props.addresses.setIn(fieldSeq, value)
    this.props.onChange(addresses)
  }

  deleteAddress(index) {
    const addresses = this.props.addresses.delete(index)
    this.props.onChange(addresses)
  }

  render() {
    const {addresses} = this.props
    return (
      <div id='addresses'>
        {
          addresses.map((area, index) => {
            const {id, street_address, city, state, zip, type} = area.toJS()
            return (
              <div key={index} className='row list-item' id={`address-${id}`}>
                <AddressEditView
                  streetAddress={street_address || ''}
                  city={city || ''}
                  state={state || ''}
                  zip={zip || ''}
                  type={type || ''}
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
              <i className='fa fa-plus' />
              <span> Add new address</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
}

AddressesEditView.propTypes = {
  addresses: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}
