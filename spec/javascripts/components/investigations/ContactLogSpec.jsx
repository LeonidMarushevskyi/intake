import ContactLog from 'investigations/ContactLog'
import React from 'react'
import {shallow} from 'enzyme'

describe('ContactLog', () => {
  function renderContactLog({id = 'ABC123'}) {
    const props = {id}
    return shallow(<ContactLog {...props} />)
  }

  it('displays the investigation id in the header', () => {
    const component = renderContactLog({id: 'ABCD1234'})
    const link = component.find('Link')
    expect(link.props().to).toEqual('/investigations/ABCD1234/contacts/new')
    expect(link.html()).toEqual('<a target="_blank">Create New Contact</a>')
  })
})
