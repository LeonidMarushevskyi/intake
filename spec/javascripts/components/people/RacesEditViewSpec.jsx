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
      races: Immutable.List(['Asian', 'White']),
      onChange: onChange,
    }
    component = shallow(<RacesEditView {...props}/>)
  })

  it('renders the race checkboxes', () => {
    const list = component.find('.css-column-count--two')
    expect(list.find('input[value="White"]').length).toEqual(1)
    expect(list.find('input[value="Black or African American"]').length).toEqual(1)
    expect(list.find('input[value="Asian"]').length).toEqual(1)
    expect(list.find('input[value="American Indian or Alaska Native"]').length).toEqual(1)
    expect(list.find('input[value="Native Hawaiian or Other Pacific Islander"]').length).toEqual(1)
    expect(list.find('input[value="Unknown"]').length).toEqual(1)
    expect(list.find('input[value="Abandoned"]').length).toEqual(1)
    expect(list.find('input[value="Declined to answer"]').length).toEqual(1)
  })

  it('preselects races passed from props', () => {
    expect(component.find('input[value="White"]').props().checked).toEqual(true)
    expect(component.find('input[value="Asian"]').props().checked).toEqual(true)
    expect(component.find('input[value="Black or African American"]').props().checked).toEqual(false)
    expect(component.find('input[value="Unknown"]').props().checked).toEqual(false)
  })

  describe('when checkboxes are checked', () => {
    it('calls onChange with the new races', () => {
      const input = component.find('input[value="Black or African American"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        'Asian',
        'White',
        'Black or African American',
      ])
    })
  })

  describe('when checkboxes are unchecked', () => {
    it('calls onChange with the new races', () => {
      const input = component.find('input[value="Asian"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        'White',
      ])
    })
  })

  describe('when one of the race uncertain checkbox is checked', () => {
    it('removes all selected races and calls onChange with its value', () => {
      const input = component.find('input[value="Unknown"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([
        'Unknown',
      ])
    })

    it('disables other checkboxes', () => {
      const props = {
        races: Immutable.List(['Unknown']),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      expect(component.find('input').length).toEqual(8)
      expect(component.find('input[disabled=true]').length).toEqual(7)
    })
  })

  describe('when the race uncertain checkbox is unchecked', () => {
    it('removes all selected races and calls onChange with []', () => {
      const props = {
        races: Immutable.List(['Unknown']),
        onChange: onChange,
      }
      component = shallow(<RacesEditView {...props}/>)
      const input = component.find('input[value="Unknown"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual([])
    })
  })
})
