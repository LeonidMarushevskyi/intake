import PersonInformationForm from 'views/people/PersonInformationForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonInformationForm', () => {
  function renderPersonForm({
    personId = '123',
    roles,
    roleOptions,
    legacySourceDescription,
    firstName,
    middleName,
    lastName,
    nameSuffix,
    nameSuffixOptions = [],
    ssn,
    onChange,
  }) {
    const props = {
      personId,
      roles,
      roleOptions,
      legacySourceDescription,
      firstName,
      middleName,
      lastName,
      nameSuffix,
      nameSuffixOptions,
      ssn,
      onChange,
    }
    return shallow(<PersonInformationForm {...props}/>)
  }

  it('renders the legacySourceDescription', () => {
    const legacySource = renderPersonForm({
      legacySourceDescription: 'from some legacy source',
    }).find('.c-dark-grey.double-gap-top')
    expect(legacySource.exists()).toEqual(true)
    expect(legacySource.text()).toContain('from some legacy source')
  })

  it('renders the role field as a multiselect', () => {
    const component = renderPersonForm({
      personId: 'existing-person-id',
      roles: ['A', 'B'],
      roleOptions: [
        {label: 'label 1', value: 'label_1', disabled: true},
        {label: 'label 2', value: 'label_2'},
        {label: 'label 3', value: 'label_3'},
      ],
    })
    const select = component.find('Select')
    const label = component.find('label[children="Role"]')
    expect(label.exists()).toEqual(true)
    expect(label.props().htmlFor).toEqual('roles_existing-person-id')

    expect(select.exists()).toEqual(true)
    expect(select.props().value).toEqual(['A', 'B'])
    expect(select.props().inputProps).toEqual({id: 'roles_existing-person-id'})
    expect(select.props().options).toEqual([
      {label: 'label 1', value: 'label_1', disabled: true},
      {label: 'label 2', value: 'label_2'},
      {label: 'label 3', value: 'label_3'},
    ])
  })

  it('changing roles fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({onChange, roles: []})
      .find('Select').simulate('change', [
        {label: 'label 1', value: 'label_1'},
        {label: 'label 2', value: 'label_2'},
      ])
    expect(onChange).toHaveBeenCalledWith('roles', ['label_1', 'label_2'])
  })

  it('renders the first name field', () => {
    const field = renderPersonForm({firstName: 'a sample first name'})
      .find('InputField[label="First Name"]')
    expect(field.exists()).toEqual(true)
    expect(field.props().value).toEqual('a sample first name')
  })

  it('changing the first name fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({firstName: 'a sample first name', onChange})
      .find('InputField[label="First Name"]')
      .simulate('change', {target: {value: 'my new name'}})
    expect(onChange).toHaveBeenCalledWith('first_name', 'my new name')
  })

  it('renders the middle name field', () => {
    const field = renderPersonForm({middleName: 'a sample middle name'})
      .find('InputField[label="Middle Name"]')
    expect(field.exists()).toEqual(true)
    expect(field.props().value).toEqual('a sample middle name')
  })

  it('changing the middle name fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({middleName: 'a sample middle name', onChange})
      .find('InputField[label="Middle Name"]')
      .simulate('change', {target: {value: 'my new name'}})
    expect(onChange).toHaveBeenCalledWith('middle_name', 'my new name')
  })

  it('renders the last name field', () => {
    const field = renderPersonForm({lastName: 'a sample last name'})
      .find('InputField[label="Last Name"]')
    expect(field.exists()).toEqual(true)
    expect(field.props().value).toEqual('a sample last name')
  })

  it('changing the last name fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({lastName: 'a sample last name', onChange})
      .find('InputField[label="Last Name"]')
      .simulate('change', {target: {value: 'my new name'}})
    expect(onChange).toHaveBeenCalledWith('last_name', 'my new name')
  })

  it('renders the suffix field', () => {
    const field = renderPersonForm({
      nameSuffix: 'Blah',
      nameSuffixOptions: [
        {value: '1'},
        {value: '2'},
        {value: '3'},
      ],
    }).find('SelectField[label="Suffix"]')
    expect(field.exists()).toEqual(true)
    expect(field.props().value).toEqual('Blah')
    expect(field.childAt(0).props().value).toEqual('')
    expect(field.childAt(1).props().value).toEqual('1')
    expect(field.childAt(2).props().value).toEqual('2')
    expect(field.childAt(3).props().value).toEqual('3')
  })

  it('changing the suffix fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({onChange})
      .find('SelectField[label="Suffix"]')
      .simulate('change', {target: {value: 'my new suffix'}})
    expect(onChange).toHaveBeenCalledWith('name_suffix', 'my new suffix')
  })

  it('renders the SSN field', () => {
    const field = renderPersonForm({
      ssn: 'example-ssn',
    }).find('MaskedInputField[label="Social security number"]')
    expect(field.exists()).toEqual(true)
    expect(field.props().value).toEqual('example-ssn')
  })

  it('changing the ssn fires onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    renderPersonForm({onChange})
      .find('MaskedInputField[label="Social security number"]')
      .simulate('change', {target: {value: '111-11-1111'}})
    expect(onChange).toHaveBeenCalledWith('ssn', '111-11-1111')
  })
})
