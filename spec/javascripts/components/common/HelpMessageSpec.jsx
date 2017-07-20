import React from 'react'
import {shallow} from 'enzyme'
import HelpMessage from 'components/common/HelpMessage'

describe('HelpMessage', () => {
  it('renders the message text passed to it', () => {
    const messageText = 'Help me Obi-Wan Kenobi'
    const component = shallow(<HelpMessage message={messageText} />)
    expect(component.text()).toEqual(messageText)
  })
})
