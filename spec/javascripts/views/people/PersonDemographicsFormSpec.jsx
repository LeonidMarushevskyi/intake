import PersonForm from 'views/people/PersonDemographicsForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonDemographicsForm', () => {
  function renderPersonDemographicsForm({
    approximateAge,
    approximateAgeIsDisabled,
    approximateAgeUnit,
    approximateAgeUnitOptions = [],
    dateOfBirth,
    gender,
    genderOptions = [],
    languageOptions = [],
    languages,
    onChange,
    personId,
  }) {
    const props = {
      approximateAge,
      approximateAgeIsDisabled,
      approximateAgeUnit,
      approximateAgeUnitOptions,
      dateOfBirth,
      gender,
      genderOptions,
      languageOptions,
      languages,
      onChange,
      personId,
    }
    return shallow(<PersonForm {...props}/>)
  }

  it('renders the date of birth field', () => {
    const field = renderPersonDemographicsForm({dateOfBirth: '2/22/2022'})
      .find('DateField[label="Date of birth"]')
    expect(field.props().value).toEqual('2/22/2022')
  })

  it('renders disabled approximate age fields', () => {
    const form = renderPersonDemographicsForm({approximateAgeIsDisabled: true})
    expect(form.find('InputField[label="Approximate Age"]').props().disabled).toBe(true)
    expect(form.find('select[aria-label="Approximate Age Units"]').props().disabled).toBe(true)
  })

  it('renders enabled approximate age fields', () => {
    const form = renderPersonDemographicsForm({approximateAgeIsDisabled: false})
    expect(form.find('InputField[label="Approximate Age"]').props().disabled).toBe(false)
    expect(form.find('select[aria-label="Approximate Age Units"]').props().disabled).toBe(false)
  })

  it('renders the approximate age unit field and its options', () => {
    const field = renderPersonDemographicsForm({
      approximateAgeUnit: '5', approximateAgeUnitOptions: [{value: '1'}, {value: '2'}],
    }).find('select[aria-label="Approximate Age Units"]')
    expect(field.props().value).toEqual('5')
    expect(field.childAt(0).props().value).toEqual('1')
    expect(field.childAt(1).props().value).toEqual('2')
  })

  it('renders the gender field and its options', () => {
    const field = renderPersonDemographicsForm({
      gender: '0', genderOptions: [{value: '1'}, {value: '2'}],
    }).find('SelectField[label="Gender"]')
    expect(field.props().value).toEqual('0')
    expect(field.childAt(0).props().value).toEqual('')
    expect(field.childAt(1).props().value).toEqual('1')
    expect(field.childAt(2).props().value).toEqual('2')
  })

  it('renders the languages field and its options', () => {
    const form = renderPersonDemographicsForm({
      personId: '1', languages: ['0'], languageOptions: [{value: '1'}, {value: '2'}],
    })
    expect(form.find('label[htmlFor="languages_1"]').props().children)
      .toEqual('Language(s) (Primary First)')
    expect(form.find('Select').props().value).toEqual(['0'])
    expect(form.find('Select').props().options).toEqual([{value: '1'}, {value: '2'}])
  })

  describe('onChange', () => {
    let onChange
    beforeEach(() => {
      onChange = jasmine.createSpy('onChange')
    })

    it('is fired when date of birth changes', () => {
      renderPersonDemographicsForm({dateOfBirth: '2/22/2022', onChange})
        .find('DateField[label="Date of birth"]').simulate('change', '1/11/2022')
      expect(onChange).toHaveBeenCalledWith('date_of_birth', '1/11/2022')
    })

    it('is fired when approximate age changes', () => {
      renderPersonDemographicsForm({approximateAge: '2', onChange})
        .find('InputField[label="Approximate Age"]').simulate('change', {target: {value: '1'}})
      expect(onChange).toHaveBeenCalledWith('approximate_age', '1')
    })

    it('is fired when approximate age units changes', () => {
      renderPersonDemographicsForm({onChange}).find('select[aria-label="Approximate Age Units"]')
        .simulate('change', {target: {value: '0'}})
      expect(onChange).toHaveBeenCalledWith('approximate_age_units', '0')
    })

    it('is fired when gender changes', () => {
      renderPersonDemographicsForm({gender: '0', onChange}).find('SelectField[label="Gender"]')
        .simulate('change', {target: {value: '1'}})
      expect(onChange).toHaveBeenCalledWith('gender', '1')
    })

    it('is fired when languages change', () => {
      renderPersonDemographicsForm({languages: ['C++'], onChange}).find('Select')
        .simulate('change', ['binary'])
      expect(onChange).toHaveBeenCalledWith('languages', ['binary'])
    })
  })
})
