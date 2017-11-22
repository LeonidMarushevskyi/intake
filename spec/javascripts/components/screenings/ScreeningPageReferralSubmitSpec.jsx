import * as IntakeConfig from 'common/config'
import Immutable from 'immutable'
import React from 'react'
import {ScreeningPage} from 'screenings/ScreeningPage'
import {shallow} from 'enzyme'

describe('ScreeningPage when referral_submit feature is active', () => {
  const sdmPath = 'https://ca.sdmdata.org'

  const requiredScreeningAttributes = {
    allegations: [],
    id: '123456',
    safety_alerts: [],
    cross_reports: [],
  }

  const requiredProps = {
    actions: {fetchScreening: () => null},
    staffActions: {checkStaffPermission: () => null},
    params: {id: '1'},
    participants: Immutable.List(),
    screening: Immutable.fromJS(requiredScreeningAttributes),
    involvements: Immutable.fromJS({screenings: []}),
    relationships: Immutable.List(),
    mode: 'edit',
    editable: true,
  }

  const isFeatureActiveFake = (feature) => {
    if (feature === 'referral_submit') {
      return true
    } else {
      return false
    }
  }

  const isFeatureInactiveFake = (feature) => {
    if (feature === 'referral_submit') {
      return false
    } else {
      return true
    }
  }

  beforeEach(() => {
    spyOn(IntakeConfig, 'isFeatureInactive').and.callFake(isFeatureInactiveFake)
    spyOn(IntakeConfig, 'isFeatureActive').and.callFake(isFeatureActiveFake)
    spyOn(IntakeConfig, 'sdmPath').and.returnValue(sdmPath)
  })

  describe('when release two is not active', () => {
    describe('when the screning does not have a referral id', () => {
      it('renders the submit button without a modal', () => {
        const component = shallow(<ScreeningPage {...requiredProps} loaded={true} />)
        expect(component.find('ScreeningSubmitButton').exists()).toEqual(true)
        expect(component.find('ScreeningSubmitButtonWithModal').exists()).toEqual(false)
      })
    })

    describe('when the screening is not editable', () => {
      const screening = {
        ...requiredScreeningAttributes,
        referral_id: 'ABCDEF',
      }

      const props = {
        ...requiredProps,
        screening: Immutable.fromJS(screening),
        loaded: true,
        editable: false,
      }

      it('renders neither submit button', () => {
        const component = shallow(<ScreeningPage {...props} />)
        expect(component.find('ScreeningSubmitButton').exists()).toEqual(false)
        expect(component.find('ScreeningSubmitButtonWithModal').exists()).toEqual(false)
      })
    })
  })
})

