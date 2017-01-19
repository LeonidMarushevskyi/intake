import EthnicityEditView from 'components/people/EthnicityEditView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'

describe('EthnicityEditView', () => {
  let component
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    const props = {
      ethnicity: Immutable.Map(),
      onChange: onChange,
    }
    component = shallow(<EthnicityEditView {...props}/>)
  })

  it('renders the ethnicity checkboxes', () => {
    const checkboxes = component.find('CheckboxField')
    expect(checkboxes.length).toEqual(5)
    expect(checkboxes.nodes.map((checkbox) => checkbox.props.value)).toEqual([
      'Yes',
      'No',
      'Unknown',
      'Abandoned',
      'Declined to answer',
    ])
  })

  describe('when checkbox is checked', () => {
    it('calls onChange with the new ethnicity', () => {
      const input = component.find('CheckboxField[value="Yes"]')
      input.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0].toJS()).toEqual({
        hispanic_latino_origin: 'Yes',
      })
    })

    it('disables other checkboxes', () => {
      expect(component.find('CheckboxField[disabled=true]').length).toEqual(0)
      component.setProps({
        ethnicity:
          Immutable.fromJS({
            hispanic_latino_origin: 'Yes',
          }),
      })
      expect(component.find('CheckboxField[disabled=true]').length).toEqual(4)
    })
  })

  describe('when other than "Yes" is selected as ethnicity', () => {
    it('do not show any dropdown', () => {
      component.setProps({
        ethnicity:
          Immutable.fromJS({
            hispanic_latino_origin: 'Unknown',
          }),
      })
      expect(component.find('SelectField').length).toEqual(0)
    })
  })

  describe('when "Yes" is selected as ethnicity', () => {
    beforeEach(() => {
      component.setProps({
        ethnicity:
          Immutable.fromJS({
            hispanic_latino_origin: 'Yes',
          }),
      })
    })

    it('shows the ethnicity detail dropdown', () => {
      expect(component.find('SelectField').length).toEqual(1)
    })

    describe('and ethnicity detail is chosen', () => {
      it('calls onChange with the ethnicity detail', () => {
        const dropdown = component.find('SelectField')
        dropdown.simulate('change', {target: {value: 'Mexican'}})
        expect(onChange).toHaveBeenCalled()
        expect(onChange.calls.argsFor(0)[0].toJS()).toEqual({
          hispanic_latino_origin: 'Yes',
          ethnicity_detail: 'Mexican',
        })
      })
    })
  })

  describe('when checkbox is unchecked', () => {
    it('calls onChange with the new ethnicity', () => {
      component.setProps({
        ethnicity:
          Immutable.fromJS({
            hispanic_latino_origin: 'Yes',
          }),
      })
      const input = component.find('CheckboxField[value="Yes"]')
      input.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalled()
      expect(onChange.calls.argsFor(0)[0]).toEqual(null)
    })
  })
})
