import React from 'react'
import {shallow} from 'enzyme'
import ScreeningDecisionShow from 'views/screening_decision/ScreeningDecisionShow'

describe('ScreeningDecisionShow', () => {
  const renderScreeningDecisionShow = ({
    accessRestriction = {},
    additionalInformation = {},
    decision = {},
    decisionDetail = {},
    restrictionRationale = {},
    ...options
  }) => {
    const props = {
      accessRestriction,
      additionalInformation,
      decision,
      decisionDetail,
      restrictionRationale,
      ...options,
    }
    return shallow(<ScreeningDecisionShow {...props}/>)
  }

  it('renders "Screening decision" in the card header', () => {
    const component = renderScreeningDecisionShow({})
    expect(component.find('.card-header').text()).toEqual('Decision')
  })

  it('renders an Edit Link with the correct props if onEdit is passed', () => {
    const onEdit = jasmine.createSpy('onEdit')
    const component = renderScreeningDecisionShow({onEdit})
    const editLink = component.find('EditLink')
    expect(editLink.exists()).toEqual(true)
    expect(editLink.props().ariaLabel).toEqual('Edit decision')
    editLink.simulate('click', {preventDefault: () => {}})
    expect(onEdit).toHaveBeenCalled()
  })

  it('does not render an Edit Link if no onEdit is passed', () => {
    const component = renderScreeningDecisionShow({})
    const editLink = component.find('EditLink')
    expect(editLink.exists()).toEqual(false)
  })

  it('renders the decision header and value', () => {
    const component = renderScreeningDecisionShow({
      decision: {
        value: 'Promote to referral',
        errors: ['This is not ok!'],
      },
    })
    const decision = component.find('ShowField[label="Screening decision"]')
    expect(decision.exists()).toEqual(true)
    expect(decision.props().label).toEqual('Screening decision')
    expect(decision.props().required).toEqual(true)
    expect(decision.props().errors).toEqual(['This is not ok!'])
    expect(decision.children().text()).toEqual('Promote to referral')
  })

  it('renders the decision detail header, label, and value', () => {
    const component = renderScreeningDecisionShow({
      decisionDetail: {
        value: '3 days',
        errors: ['This is not ok!'],
        label: 'Response time',
        required: true,
      },
    })
    const decisionDetail = component.find('ShowField[label="Response time"]')
    expect(decisionDetail.exists()).toEqual(true)
    expect(decisionDetail.props().label).toEqual('Response time')
    expect(decisionDetail.props().required).toEqual(true)
    expect(decisionDetail.props().errors).toEqual(['This is not ok!'])
    expect(decisionDetail.children().text()).toEqual('3 days')
  })

  it('does not require decision detail if required is false', () => {
    const component = renderScreeningDecisionShow({
      decisionDetail: {
        label: 'Response time',
        required: false,
      },
    })
    const decisionDetail = component.find('ShowField[label="Response time"]')
    expect(decisionDetail.props().required).toEqual(false)
  })

  it('renders a link to the SDM tool', () => {
    const sdmPath = 'http://foo.com'
    const component = renderScreeningDecisionShow({sdmPath})
    expect(component.text()).toContain('SDM Hotline Tool')
    expect(component.text()).toContain('Determine Decision and Response Time by using Structured Decision Making.')
    const sdmLink = component.find('a')
    expect(sdmLink.props().href).toEqual(sdmPath)
    expect(sdmLink.props().target).toEqual('_blank')
    expect(sdmLink.text()).toEqual('Complete SDM')
  })

  it('renders additional information', () => {
    const component = renderScreeningDecisionShow({
      additionalInformation: {value: 'My additional information'},
    })
    const additionalInformation = component.find('ShowField[label="Additional information"]')
    expect(additionalInformation.exists()).toEqual(true)
    expect(additionalInformation.props().label).toEqual('Additional information')
    expect(additionalInformation.children().text()).toEqual('My additional information')
  })

  it('renders access restrictions', () => {
    const component = renderScreeningDecisionShow({
      accessRestriction: {value: 'Sealed'},
    })
    const accessRestriction = component.find('ShowField[label="Access restrictions"]')
    expect(accessRestriction.exists()).toEqual(true)
    expect(accessRestriction.props().label).toEqual('Access restrictions')
    expect(accessRestriction.children().text()).toEqual('Sealed')
  })

  it('renders restriction rationale when a value is present', () => {
    const component = renderScreeningDecisionShow({
      restrictionRationale: {value: 'This person needs to be protected'},
    })
    const restrictionRationale = component.find('ShowField[label="Restrictions rationale"]')
    expect(restrictionRationale.exists()).toEqual(true)
    expect(restrictionRationale.props().label).toEqual('Restrictions rationale')
    expect(restrictionRationale.children().text()).toEqual('This person needs to be protected')
  })

  it('does not render restriction rationale when no value is present', () => {
    const component = renderScreeningDecisionShow({value: ''})
    const restrictionRationale = component.find('ShowField[label="Restriction rationale"]')
    expect(restrictionRationale.exists()).toEqual(false)
  })
})
