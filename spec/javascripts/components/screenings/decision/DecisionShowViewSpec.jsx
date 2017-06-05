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

  it('renders the report narrative label as required', () => {
    expect(component.find('ShowField[label="Screening Decision"]').props().labelClassName)
      .toEqual('required')
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

  it('renders the show fields with text input decision_detail', () => {
    const screening = Immutable.fromJS({
      additional_information: 'the decision is decided',
      screening_decision: 'differential_response',
      screening_decision_detail: 'Some character string',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Differential response')
    expect(component.find('ShowField[label="Service name"]').html())
      .toContain('Some character string')
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('the decision is decided')
  })

  it('renders the show fields with selectable decision_detail', () => {
    const screening = Immutable.fromJS({
      additional_information: 'the decision is decided',
      screening_decision: 'screen_out',
      screening_decision_detail: 'consultation',
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').props().children)
      .toEqual('Screen out')
    expect(component.find('ShowField[label="Category"]').html())
      .toContain('Consultation')
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('the decision is decided')
  })

  it('renders show fields correctly when values are not set', () => {
    const screening = Immutable.fromJS({
      screening_decision_detail: null,
      screening_decision: null,
      additional_information: null,
    })
    const component = shallow(<DecisionShowView screening={screening} onEdit={onEdit}/>)
    expect(component.find('ShowField').length).toEqual(3)
    expect(component.find('ShowField[label="Screening Decision"]').html())
      .toContain('<div class="c-gray"></div>')
    expect(component.find('ShowField[label="Category"]').length).toEqual(0)
    expect(component.find('ShowField[label="Additional information"]').html())
      .toContain('<div class="c-gray"></div>')
  })
})
