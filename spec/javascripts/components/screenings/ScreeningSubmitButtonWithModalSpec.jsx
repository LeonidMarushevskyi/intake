import React from 'react'
import ScreeningSubmitButtonWithModal from 'screenings/ScreeningSubmitButtonWithModal'
import {shallow} from 'enzyme'

describe('ScreeningSubmitButtonWithModal', () => {
  it('ties the submit button to the modal using proper bootstrap data tags', () => {
    const component = shallow(<ScreeningSubmitButtonWithModal />)
    const button = component.find('button[children="Submit"]').simulate('click')
    expect(button.html()).toContain('data-target="#submitModal"')
    const modal = component.find('#submitModal')
    expect(modal.exists()).toEqual(true)
  })
})

