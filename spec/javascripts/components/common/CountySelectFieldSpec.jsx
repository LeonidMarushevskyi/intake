import CountySelectField from 'common/CountySelectField'
import React from 'react'
import {shallow} from 'enzyme'

describe('CountySelectField', () => {
  function renderCountySelectField({
    counties = [],
    gridClassName = 'gridClassName',
    id = 'county-select',
    onChange = () => null,
    value = null,
  }) {
    const props = {
      counties,
      gridClassName,
      id,
      onChange,
      value,
    }
    return shallow(<CountySelectField {...props} />)
  }

  it('displays the select field', () => {
    const component = renderCountySelectField({counties: [
      {code: '123', value: 'San Francisco'},
      {code: '456', value: 'Sacramento'},
    ]})
    expect(component.find('option[value="123"]').text()).toEqual('San Francisco')
  })

  it('selects the value passed in', () => {
    const component = renderCountySelectField({counties: [
      {code: '123', value: 'San Francisco'},
      {code: '456', value: 'Sacramento'},
    ],
    value: '456'})
    expect(component.find('SelectField').props().value).toEqual('456')
  })

  it('passes onChange, id, and gridClassName to select field', () => {
    const onChange = jasmine.createSpy('onChange')
    const component = renderCountySelectField({
      gridClassName: 'my-class-name',
      id: 'my-id',
      onChange: onChange,
    })
    expect(component.find('SelectField').props().gridClassName).toEqual('my-class-name')
    expect(component.find('SelectField').props().id).toEqual('my-id')
    expect(component.find('SelectField').props().onChange).toEqual(onChange)
  })
})
