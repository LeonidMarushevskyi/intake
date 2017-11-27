import Immutable from 'immutable'
import ParticipantCardView from 'screenings/ParticipantCardView'
import React from 'react'
import {shallow} from 'enzyme'

describe('ParticipantCardView', () => {
  it('renders the card header', () => {
    const participant = Immutable.fromJS({
      id: '123',
      first_name: 'Alex',
      last_name: 'Doe',
      sealed: true,
    })
    const props = {participant}
    const component = shallow(<ParticipantCardView {...props} />)
    const header = component.find('Connect(PersonCard)')
    expect(header.props().toggleMode).toEqual(jasmine.any(Function))
    expect(header.props().personId).toEqual('123')
  })

  describe('#toggleMode', () => {
    it('toggles the mode to edit', () => {
      const component = shallow(<ParticipantCardView participant={Immutable.Map()} mode={'show'} />)
      const instance = component.instance()
      instance.toggleMode()
      expect(instance.state.mode).toEqual('edit')
    })
  })
})
