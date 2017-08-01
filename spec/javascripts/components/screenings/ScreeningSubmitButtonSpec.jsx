import * as config from 'common/config'
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

  describe('when referral_submit is active', () => {
    beforeEach(() => {
      spyOn(config, 'isFeatureActive')
      config.isFeatureActive.and.returnValue(true)
    })

    it('clicking the submit button submits the screening', () => {
      component.find('button[children="Submit"]').simulate('click')
      expect(config.isFeatureActive).toHaveBeenCalledWith('referral_submit')
      expect(submitScreening).toHaveBeenCalledWith('99')
    })
  })

  describe('when referral_submit is not active', () => {
    beforeEach(() => {
      spyOn(config, 'isFeatureActive')
      config.isFeatureActive.and.returnValue(false)
    })

    it('clicking the submit button does not submits the screening', () => {
      component.find('button[children="Submit"]').simulate('click')
      expect(config.isFeatureActive).toHaveBeenCalledWith('referral_submit')
      expect(submitScreening).not.toHaveBeenCalled()
    })
  })
})
