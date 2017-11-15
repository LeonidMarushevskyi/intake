import React from 'react'
import {shallow} from 'enzyme'
import AllegationsForm from 'views/allegations/AllegationsForm'

describe('AllegationsForm', () => {
  const renderAllegationsForm = ({allegations = [], ...args}) => {
    const props = {allegations, ...args}
    return shallow(<AllegationsForm {...props}/>)
  }

  it('renders the card header', () => {
    const component = renderAllegationsForm({})
    expect(component.find('.card-header').text()).toEqual('Allegations')
  })

  it('calls onSave when the save button is clicked', () => {
    const onSave = jasmine.createSpy('onSave')
    const component = renderAllegationsForm({onSave})
    component.find('.btn-primary').simulate('click')
    expect(onSave).toHaveBeenCalled()
  })

  it('calls onCancel when the cancel button is clicked', () => {
    const onCancel = jasmine.createSpy('onCancel')
    const component = renderAllegationsForm({onCancel})
    component.find('.btn-default').simulate('click')
    expect(onCancel).toHaveBeenCalled()
  })

  it('displays an alert error message if one is passed', () => {
    const alertErrorMessage = 'Something is wrong!'
    const component = renderAllegationsForm({alertErrorMessage})
    expect(component.find('AlertErrorMessage').exists()).toEqual(true)
    expect(component.find('AlertErrorMessage').props().message).toEqual(alertErrorMessage)
  })

  it('does not render an alert error message if none is passed', () => {
    const component = renderAllegationsForm({})
    expect(component.find('AlertErrorMessage').exists()).toEqual(false)
  })

  it('renders column headings for the table', () => {
    const component = renderAllegationsForm({})
    expect(component.find('th').at(0).text()).toEqual('Alleged Victim/Children')
    expect(component.find('th').at(1).text()).toEqual('Alleged Perpetrator')
    expect(component.find('th').at(2).text()).toEqual('Allegation(s)')
  })

  it('renders "required" if allegations are required', () => {
    const component = renderAllegationsForm({required: true})
    expect(component.find('th').at(2).text()).toEqual('Allegation(s) (Required)')
  })

  it('renders the victim name for an allegation in the first column', () => {
    const allegations = [{victimName: 'John Smith', allegationTypes: []}]
    const component = renderAllegationsForm({allegations})
    expect(component.find('tbody tr td').at(0).text()).toEqual('John Smith')
  })

  it('renders the perpetrator name for an allegation in the second column', () => {
    const allegations = [{perpetratorName: 'John Smith', allegationTypes: []}]
    const component = renderAllegationsForm({allegations})
    expect(component.find('tbody tr td').at(1).text()).toEqual('John Smith')
  })

  describe('allegationTypes multiselect', () => {
    const allegationTypes = [
      {value: '123', label: 'General neglect'},
      {value: 'ABC', label: 'Physical abuse'},
    ]
    const allegations = [{
      victimName: 'John Smith',
      victimId: 'XYZ',
      perpetratorName: 'Jane Doe',
      perpetratorId: '789',
      allegationTypes: ['123', 'ABC'],
    }]

    it('renders a multiselect for each allegation with the passed allegation types', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.exists()).toEqual(true)
      expect(allegationTypesSelect.props().options).toEqual([
        {value: '123', label: 'General neglect'},
        {value: 'ABC', label: 'Physical abuse'},
      ])
    })

    it('properly sets the default props for the multiselect', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props().multi).toEqual(true)
      expect(allegationTypesSelect.props().tabSelectsValue).toEqual(false)
      expect(allegationTypesSelect.props().clearable).toEqual(false)
      expect(allegationTypesSelect.props().placeholder).toEqual('')
    })

    it('sets accessibility properties, including aria-label and css id', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props()['aria-label']).toEqual('allegations John Smith Jane Doe')
      expect(allegationTypesSelect.props().inputProps).toEqual({id: 'allegations_XYZ_789'})
    })

    it('passes the selected values for the allegation to the multiselect', () => {
      const component = renderAllegationsForm({allegations, allegationTypes})
      const allegationTypesSelect = component.find('Select')
      expect(allegationTypesSelect.props().value).toEqual([
        {value: '123', label: '123'},
        {value: 'ABC', label: 'ABC'},
      ])
    })

    it('when changed, calls onChange with the victim id, perpetrator id, and selected values', () => {
      const onChange = jasmine.createSpy('onChange')
      const component = renderAllegationsForm({allegations, allegationTypes, onChange})
      const allegationTypesSelect = component.find('Select')
      allegationTypesSelect.simulate('change', [{value: '123', label: 'General neglect'}])
      expect(onChange).toHaveBeenCalledWith({victimId: 'XYZ', perpetratorId: '789', allegationTypes: ['123']})
    })
  })
})
