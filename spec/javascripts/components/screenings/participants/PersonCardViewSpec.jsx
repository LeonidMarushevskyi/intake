import PersonCardView from 'screenings/PersonCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonCardView', () => {
  it('renders the card header', () => {
    const props = {personId: '123'}
    const component = shallow(<PersonCardView {...props} />, {disableLifecycleMethods: true})
    const header = component.find('Connect(PersonCard)')
    expect(header.props().personId).toEqual('123')
  })
})
