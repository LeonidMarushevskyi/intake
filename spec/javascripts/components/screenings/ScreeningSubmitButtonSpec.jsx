import React from 'react'
import ScreeningSubmitButton from 'screenings/ScreeningSubmitButton'
import {shallow} from 'enzyme'

describe('ScreeningSubmitButton', () => {
  const renderScreeningSubmitButton = ({params = {id: '1'}, actions = {}, disabled = false}) => {
    const props = {
      params,
      actions,
      disabled,
    }
    return shallow(<ScreeningSubmitButton {...props} />)
  }

  it('clicking the submit button submits the screening', () => {
    const submitScreening = jasmine.createSpy('submitScreening')
    const params = {id: '99'}
    const actions = {submitScreening}
    const disabled = false
    const component = renderScreeningSubmitButton({params, actions, disabled})
    const submitButton = component.find('button[children="Submit"]')
    expect(submitButton.props().disabled).toEqual(false)
    submitButton.simulate('click')
    expect(submitScreening).toHaveBeenCalledWith('99')
  })

  it('disables the submit button if disabled is true', () => {
    const component = renderScreeningSubmitButton({disabled: true})
    const submitButton = component.find('button[children="Submit"]')
    expect(submitButton.props().disabled).toEqual(true)
  })
})
