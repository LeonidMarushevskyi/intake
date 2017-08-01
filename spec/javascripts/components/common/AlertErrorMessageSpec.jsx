import React from 'react'
import {shallow} from 'enzyme'
import AlertErrorMessage from 'common/AlertErrorMessage'

describe('AlertErrorMessage', () => {
  it('renders the message text passed to it', () => {
    const messageText = 'Help! Help! I am being repressed!'
    const component = shallow(<AlertErrorMessage message={messageText} />)
    expect(component.text()).toEqual(messageText)
  })
})
