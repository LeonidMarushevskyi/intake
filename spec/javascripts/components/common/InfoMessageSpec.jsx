import React from 'react'
import {shallow} from 'enzyme'
import InfoMessage from 'components/common/InfoMessage'

describe('InfoMessage', () => {
  it('renders the message text passed to it', () => {
    const messageText = 'Help me Obi-Wan Kenobi'
    const component = shallow(<InfoMessage message={messageText} />)
    expect(component.text()).toEqual(messageText)
  })
})
