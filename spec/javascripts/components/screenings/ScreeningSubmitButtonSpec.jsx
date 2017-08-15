import React from 'react'
import ScreeningSubmitButton from 'screenings/ScreeningSubmitButton'
import {shallow} from 'enzyme'

describe('ScreeningSubmitButton', () => {
  let component
  let submitScreening

  beforeEach(() => {
    submitScreening = jasmine.createSpy('submitScreening')
    const props = {params: {id: '99'}, actions: {submitScreening}}
    component = shallow(<ScreeningSubmitButton {...props} />)
  })

  it('clicking the submit button submits the screening', () => {
    component.find('button[children="Submit"]').simulate('click')
    expect(submitScreening).toHaveBeenCalledWith('99')
  })
})
