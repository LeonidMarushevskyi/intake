import Immutable from 'immutable'
import RacesEditView from 'people/RacesEditView'
import React from 'react'
import {shallow} from 'enzyme'

describe('RacesEditView', () => {
  let component
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    const props = {
      id: 'person-123',
      races:
        Immutable.fromJS([
          {race: 'Asian'},
          {race: 'Asian', race_detail: 'Chinese'},
          {race: 'White'},
        ]),
      onChange: onChange,
    }
    component = shallow(<RacesEditView {...props}/>)
  })

  it('renders the race checkboxes', () => {
    const checkboxes = component.find('CheckboxField')
    expect(checkboxes.length).toEqual(8)
    expect(checkboxes.nodes.map((checkbox) => checkbox.props.id)).toEqual([
      'person-123-race-White',
      'person-123-race-Black_or_African_American',
      'person-123-race-Asian',
      'person-123-race-American_Indian_or_Alaska_Native',
      'person-123-race-Native_Hawaiian_or_Other_Pacific_Islander',
      'person-123-race-Unknown',
      'person-123-race-Abandoned',
      'person-123-race-Declined_to_answer',
    ])
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

  it('preselect races and race details passed to props', () => {
    expect(component.find('CheckboxField[value="White"]').props().checked).toEqual(true)
    expect(component.find('CheckboxField[value="Asian"]').props().checked).toEqual(true)
    expect(component.find('CheckboxField[value="Black or African American"]').props().checked).toEqual(false)
    expect(component.find('CheckboxField[value="Unknown"]').props().checked).toEqual(false)

    expect(component.find('SelectField').length).toEqual(2)
    expect(component.find('SelectField[id="person-123-White-race-detail"]').props().value).toEqual(undefined)
    expect(component.find('SelectField[id="person-123-Asian-race-detail"]').props().value).toEqual('Chinese')
  })

  describe('when checkboxes are checked', () => {
    it('calls onChange with the new races', () => {
      const input = component.find('CheckboxField[value="Black or African American"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'Asian', race_detail: 'Chinese'},
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
        id: 'person-123',
        races: Immutable.fromJS([{race: 'Unknown'}]),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      expect(component.find('CheckboxField').length).toEqual(8)
      expect(component.find('CheckboxField[disabled=true]').length).toEqual(7)
    })

    it('does not show the race detail dropdown', () => {
      const props = {
        id: 'person-123',
        races: Immutable.fromJS([{race: 'Unknown'}]),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      expect(component.find('SelectField').length).toEqual(0)
    })
  })

  describe('when the race uncertain checkbox is unchecked', () => {
    it('clears all selected races and calls onChange with []', () => {
      const props = {
        id: 'person-123',
        races: Immutable.fromJS([{race: 'Unknown'}]),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      const input = component.find('CheckboxField[value="Unknown"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([])
    })
  })

  describe('when selecting new race detail', () => {
    it('calls onChange with the new race detail', () => {
      const dropdown = component.find('SelectField[id="person-123-Asian-race-detail"]')
      dropdown.simulate('change', {target: {value: 'Filipino'}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'Asian', race_detail: 'Filipino'},
        {race: 'White'},
      ])
    })
  })

  describe('when removing race detail', () => {
    it('calls onChange with the new race detail', () => {
      const dropdown = component.find('SelectField[id="person-123-Asian-race-detail"]')
      dropdown.simulate('change', {target: {value: ''}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        {race: 'Asian'},
        {race: 'White'},
      ])
    })
  })
})
