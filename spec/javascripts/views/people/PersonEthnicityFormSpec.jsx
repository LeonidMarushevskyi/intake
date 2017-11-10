import React from 'react'
import {shallow} from 'enzyme'
import PersonEthnicityForm from 'views/people/PersonEthnicityForm'

describe('PersonEthnicityForm', () => {
  const renderPersonEthnicityForm = ({ethnicityDetailOptions = [], ...options}) => {
    const props = {ethnicityDetailOptions, ...options}
    return shallow(<PersonEthnicityForm {...props} />)
  }

  describe('Yes checkbox', () => {
    it('renders a check box with the proper id for Yes', () => {
      const component = renderPersonEthnicityForm({personId: '123'})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      expect(yesBox.exists()).toEqual(true)
      expect(yesBox.props().id).toEqual('123-ethnicity-yes')
    })

    it('sets checked to true if latinoOrigin is Yes', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: 'Yes'})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      expect(yesBox.props().checked).toEqual(true)
    })

    it('sets checked to false if latinoOrigin is not Yes', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: ''})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      expect(yesBox.props().checked).toEqual(false)
    })

    it('calls onChange with the proper value when checked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      yesBox.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', 'Yes')
    })

    it('calls onChange with the proper value and clears ethnicity detail when unchecked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      yesBox.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', null)
      expect(onChange).toHaveBeenCalledWith('ethnicity_detail', [])
    })

    it('sets disabled to true if disableFields is true and the value is not Yes', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: ''})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      expect(yesBox.props().disabled).toEqual(true)
    })

    it('sets disabled to false if disableFields is false and the value is Yes', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: 'Yes'})
      const yesBox = component.find('CheckboxField[label="Yes"]')
      expect(yesBox.props().disabled).toEqual(false)
    })

    describe('ethnicityDetailOptions select field', () => {
      it('does not render if latioOrigin is not set to Yes', () => {
        const component = renderPersonEthnicityForm({latinoOrigin: ''})
        const detailSelect = component.find('SelectField')
        expect(detailSelect.exists()).toEqual(false)
      })

      it('renders with no label if latioOrigin is set to Yes', () => {
        const component = renderPersonEthnicityForm({latinoOrigin: 'Yes', personId: '123'})
        const detailSelect = component.find('SelectField')
        expect(detailSelect.exists()).toEqual(true)
        expect(detailSelect.props().label).toEqual('')
        expect(detailSelect.props().value).toEqual('')
        expect(detailSelect.props().id).toEqual('123-ethnicity-detail')
      })

      it('sets the value of the selct to the current ethnicityDetail', () => {
        const component = renderPersonEthnicityForm({latinoOrigin: 'Yes', ethnicityDetail: 'Hispanic'})
        const detailSelect = component.find('SelectField')
        expect(detailSelect.exists()).toEqual(true)
        expect(detailSelect.props().value).toEqual('Hispanic')
      })

      it('calls onChange when an item is selected', () => {
        const onChange = jasmine.createSpy('onChange')
        const component = renderPersonEthnicityForm({latinoOrigin: 'Yes', onChange})
        const detailSelect = component.find('SelectField')
        detailSelect.simulate('change', {target: {value: 'Hispanic'}})
        expect(onChange).toHaveBeenCalledWith('ethnicity_detail', 'Hispanic')
      })

      it('renders ethnicityDetailOptions as options for the select', () => {
        const ethnicityDetailOptions = [
          {value: 'hispanic', label: 'Hispanic'},
          {value: 'mexican', label: 'Mexican'},
        ]
        const component = renderPersonEthnicityForm({latinoOrigin: 'Yes', ethnicityDetailOptions})
        const detailSelect = component.find('SelectField')
        const detailSelectOptions = detailSelect.children()
        expect(detailSelectOptions.at(0).props().value).toEqual('')
        expect(detailSelectOptions.at(1).props().value).toEqual('hispanic')
        expect(detailSelectOptions.at(1).children().text()).toEqual('Hispanic')
        expect(detailSelectOptions.at(2).props().value).toEqual('mexican')
        expect(detailSelectOptions.at(2).children().text()).toEqual('Mexican')
      })
    })
  })

  describe('No checkbox', () => {
    it('renders a check box with the proper id for No', () => {
      const component = renderPersonEthnicityForm({personId: '123'})
      const noBox = component.find('CheckboxField[label="No"]')
      expect(noBox.exists()).toEqual(true)
      expect(noBox.props().id).toEqual('123-ethnicity-no')
    })

    it('sets checked to true if latinoOrigin is No', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: 'No'})
      const noBox = component.find('CheckboxField[label="No"]')
      expect(noBox.props().checked).toEqual(true)
    })

    it('sets checked to false if latinoOrigin is not No', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: ''})
      const noBox = component.find('CheckboxField[label="No"]')
      expect(noBox.props().checked).toEqual(false)
    })

    it('calls onChange with the proper value when checked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const noBox = component.find('CheckboxField[label="No"]')
      noBox.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', 'No')
    })

    it('calls onChange with the proper value when unchecked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const noBox = component.find('CheckboxField[label="No"]')
      noBox.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', null)
    })

    it('sets disabled to true if disableFields is true and the value is not No', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: ''})
      const noBox = component.find('CheckboxField[label="No"]')
      expect(noBox.props().disabled).toEqual(true)
    })

    it('sets disabled to false if disableFields is false and the value is No', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: 'No'})
      const noBox = component.find('CheckboxField[label="No"]')
      expect(noBox.props().disabled).toEqual(false)
    })
  })

  describe('Unknown checkbox', () => {
    it('renders a check box with the proper id for Unknown', () => {
      const component = renderPersonEthnicityForm({personId: '123'})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      expect(unknownBox.exists()).toEqual(true)
      expect(unknownBox.props().id).toEqual('123-ethnicity-unknown')
    })

    it('sets checked to true if latinoOrigin is Unknown', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: 'Unknown'})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      expect(unknownBox.props().checked).toEqual(true)
    })

    it('sets checked to false if latinoOrigin is not Unknown', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: ''})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      expect(unknownBox.props().checked).toEqual(false)
    })

    it('calls onChange with the proper value when checked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      unknownBox.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', 'Unknown')
    })

    it('calls onChange with the proper value when unchecked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      unknownBox.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', null)
    })

    it('sets disabled to true if disableFields is true and the value is not Unknown', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: ''})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      expect(unknownBox.props().disabled).toEqual(true)
    })

    it('sets disabled to false if disableFields is false and the value is Unknown', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: 'Unknown'})
      const unknownBox = component.find('CheckboxField[label="Unknown"]')
      expect(unknownBox.props().disabled).toEqual(false)
    })
  })

  describe('Abandoned checkbox', () => {
    it('renders a check box whith the proper id for Abandoned', () => {
      const component = renderPersonEthnicityForm({personId: '123'})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      expect(abandonedBox.exists()).toEqual(true)
      expect(abandonedBox.props().id).toEqual('123-ethnicity-abandoned')
    })

    it('sets checked to true if latinoOrigin is Abandoned', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: 'Abandoned'})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      expect(abandonedBox.props().checked).toEqual(true)
    })

    it('sets checked to false if latinoOrigin is not Abandoned', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: ''})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      expect(abandonedBox.props().checked).toEqual(false)
    })

    it('calls onChange with the proper value when checked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      abandonedBox.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', 'Abandoned')
    })

    it('calls onChange with the proper value when unchecked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      abandonedBox.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', null)
    })

    it('sets disabled to true if disableFields is true and the value is not Abandoned', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: ''})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      expect(abandonedBox.props().disabled).toEqual(true)
    })

    it('sets disabled to false if disableFields is false and the value is Abandoned', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: 'Abandoned'})
      const abandonedBox = component.find('CheckboxField[label="Abandoned"]')
      expect(abandonedBox.props().disabled).toEqual(false)
    })
  })

  describe('Declined to answer checkbox', () => {
    it('renders a check box for Declined to answer', () => {
      const component = renderPersonEthnicityForm({personId: '123'})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      expect(declinedBox.exists()).toEqual(true)
      expect(declinedBox.props().id).toEqual('123-ethnicity-declined-to-answer')
    })

    it('sets checked to true if latinoOrigin is Declined to answer', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: 'Declined to answer'})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      expect(declinedBox.props().checked).toEqual(true)
    })

    it('sets checked to false if latinoOrigin is not Declined to answer', () => {
      const component = renderPersonEthnicityForm({latinoOrigin: ''})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      expect(declinedBox.props().checked).toEqual(false)
    })

    it('calls onChange with the proper value when checked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      declinedBox.simulate('change', {target: {checked: true}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', 'Declined to answer')
    })

    it('calls onChange with the proper value when unchecked', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderPersonEthnicityForm({onChange})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      declinedBox.simulate('change', {target: {checked: false}})
      expect(onChange).toHaveBeenCalledWith('hispanic_latino_origin', null)
    })

    it('sets disabled to true if disableFields is true and the value is not Declined to answer', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: ''})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      expect(declinedBox.props().disabled).toEqual(true)
    })

    it('sets disabled to false if disableFields is false and the value is Declined to answer', () => {
      const component = renderPersonEthnicityForm({disableFields: true, latinoOrigin: 'Declined to answer'})
      const declinedBox = component.find('CheckboxField[label="Declined to answer"]')
      expect(declinedBox.props().disabled).toEqual(false)
    })
  })
})
