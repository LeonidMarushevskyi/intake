import InvestigationContact from 'investigations/InvestigationContact'
import React from 'react'
import {shallow} from 'enzyme'

describe('InvestigationContact', () => {
  function renderContact({investigationId = 'ABC123'}) {
    const props = {investigationId}
    return shallow(<InvestigationContact {...props} />)
  }

  it('displays the investigation id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('h1')
    expect(header.text()).toEqual('New Contact - Investigation ABCD1234')
  })
})
