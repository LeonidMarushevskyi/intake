import React from 'react'
import {shallow} from 'enzyme'
import AlertInfoMessage from 'common/AlertInfoMessage'

describe('AlertInfoMessage', () => {
  it('renders the message text passed to it', () => {
    const messageText = 'Help me Obi-Wan Kenobi'
    const component = shallow(<AlertInfoMessage message={messageText} />)
    expect(component.text()).toEqual(messageText)
  })
})
