import Immutable from 'immutable'
import PersonCardView from 'screenings/PersonCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonCardView', () => {
  it('renders the card header', () => {
    const participant = Immutable.fromJS({
      id: '123',
      first_name: 'Alex',
      last_name: 'Doe',
      sealed: true,
    })
    const props = {participant}
    const component = shallow(<PersonCardView {...props} />)
    const header = component.find('Connect(PersonCard)')
    expect(header.props().personId).toEqual('123')
  })
})
