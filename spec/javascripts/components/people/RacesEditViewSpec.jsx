import Immutable from 'immutable'
import RacesEditView from 'components/people/RacesEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('RacesEditView', () => {
  let component
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    const props = {
      races:
        Immutable.fromJS([
          {race: 'Asian'},
          {race: 'White'},
        ]),
      onChange: onChange,
    }
    component = shallow(<RacesEditView {...props}/>)
  })

  it('renders the race checkboxes', () => {
    const checkboxes = component.find('CheckboxField')
    expect(checkboxes.length).toEqual(8)
    expect(checkboxes.nodes.map((checkbox) => checkbox.props.value)).toEqual([
      'White',
      'Black or African American',
      'Asian',
      'American Indian or Alaska Native',
      'Native Hawaiian or Other Pacific Islander',
      'Unknown',
      'Abandoned',
      'Declined to answer',
    ])
  })

  it('preselected races passed true for checked from props', () => {
    expect(component.find('CheckboxField[value="White"]').props().checked).toEqual(true)
    expect(component.find('CheckboxField[value="Asian"]').props().checked).toEqual(true)
    expect(component.find('CheckboxField[value="Black or African American"]').props().checked).toEqual(false)
    expect(component.find('CheckboxField[value="Unknown"]').props().checked).toEqual(false)
  })

  describe('when checkboxes are checked', () => {
    it('calls onChange with the new races', () => {
      const input = component.find('CheckboxField[value="Black or African American"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'Asian'},
        {race: 'White'},
        {race: 'Black or African American'},
      ])
    })
  })

  describe('when checkboxes are unchecked', () => {
    it('calls onChange with the new races', () => {
      const input = component.find('CheckboxField[value="Asian"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'White'},
      ])
    })
  })

  describe('when one of the race uncertain checkbox is checked', () => {
    it('clears selected races and calls onChange with its value', () => {
      const input = component.find('CheckboxField[value="Unknown"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'Unknown'},
      ])
    })

    it('disables other checkboxes', () => {
      const props = {
        races: Immutable.fromJS([{race: 'Unknown'}]),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      expect(component.find('CheckboxField').length).toEqual(8)
      expect(component.find('CheckboxField[disabled=true]').length).toEqual(7)
    })
  })

  describe('when the race uncertain checkbox is unchecked', () => {
    it('clears all selected races and calls onChange with []', () => {
      const props = {
        races: Immutable.fromJS([{race: 'Unknown'}]),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      const input = component.find('CheckboxField[value="Unknown"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([])
    })
  })
})
