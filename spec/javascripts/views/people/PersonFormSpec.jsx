import PersonForm from 'views/people/PersonForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonForm', () => {
  function renderPersonForm({
    personId = '123',
    roles,
    roleOptions,
    legacySourceDescription,
  }) {
    const props = {
      personId,
      roles,
      roleOptions,
      legacySourceDescription,
    }
    return shallow(<PersonForm {...props}/>)
  }

  it('renders the card body', () => {
    const cardBody = renderPersonForm({})
      .find('.card-body')
    expect(cardBody.exists()).toEqual(true)
  })

  it('renders the legacySourceDescription', () => {
    const legacySource = renderPersonForm({
      legacySourceDescription: 'from some legacy source',
    }).find('.c-dark-grey.double-gap-top')
    expect(legacySource.exists()).toEqual(true)
    expect(legacySource.text()).toContain('from some legacy source')
  })

  it('renders the participants role in a multiselect', () => {
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
})
