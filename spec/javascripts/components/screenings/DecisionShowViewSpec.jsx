import Immutable from 'immutable'
import React from 'react'
import DecisionShowView from 'components/screenings/DecisionShowView'
import {shallow} from 'enzyme'

describe('DecisionShowView', () => {
  let component
  let onEdit

  beforeEach(() => {
    onEdit = jasmine.createSpy()
    component = shallow(<DecisionShowView screening={Immutable.fromJS({})} onEdit={onEdit} />)
  })

  it('renders the card header', () => {
    expect(component.find('.card-header').text()).toContain('Decision')
  })

  it('renders the edit link', () => {
    expect(component.find('EditLink').props().ariaLabel).toEqual('Edit decision card')
  })

  describe('clicking the edit link', () => {
    beforeEach(() => {
      component.find('EditLink').simulate('click')
    })
    it('switches to edit mode when edit icon is clicked', () => {
      expect(onEdit).toHaveBeenCalled()
    })
  })

  it('render the show fields', () => {
    const screening = Immutable.fromJS({
      response_time: 'within_twenty_four_hours',
      screening_decision: 'accept_for_investigation',
      decision_rationale: 'the decision is decided',
    })

    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Response Time"]').html())
      .toContain('Within 24 hours')
    expect(component.find('ShowField[label="Screening Decision"]').html())
      .toContain('Accept for Investigation')
    expect(component.find('ShowField[label="Decision Rationale"]').html())
      .toContain('the decision is decided')
  })

  it('renders show fields correctly when values are not set', () => {
    const screening = Immutable.fromJS({
      response_time: null,
      screening_decision: null,
      decision_rationale: null,
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Response Time"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Screening Decision"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Decision Rationale"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
