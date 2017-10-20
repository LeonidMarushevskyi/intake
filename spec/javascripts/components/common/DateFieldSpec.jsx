import React from 'react'
import {shallow, mount} from 'enzyme'
import DateField from 'common/DateField'

describe('DateField', () => {
  function mountDateField({
    gridClassName,
    hasCalendar,
    hasTime,
    id = '',
    label = '',
    labelClassName,
    max,
    min,
    onBlur = () => null,
    onChange = () => null,
    required = undefined,
    value,
  } = {}) {
    const props = {
      gridClassName,
      hasCalendar,
      hasTime,
      id,
      label,
      labelClassName,
      max,
      min,
      onBlur,
      onChange,
      required,
      value,
    }
    return mount(<DateField {...props}/>)
  }
  function renderDateField({
    errors,
    gridClassName,
    id = '',
    label = '',
    labelClassName,
    onBlur = () => null,
    onChange = () => null,
    required = undefined,
  }) {
    const props = {
      errors,
      gridClassName,
      id,
      label,
      labelClassName,
      onBlur,
      onChange,
      required,
    }
    return shallow(<DateField {...props}/>)
  }

  it('passes props to the FormField', () => {
    const component = renderDateField({
      gridClassName: 'myWrapperTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      labelClassName: 'myLabelTest',
    })
    const formField = component.find('FormField')
    expect(formField.props().labelClassName).toEqual('myLabelTest')
    expect(formField.props().gridClassName).toEqual('myWrapperTest')
    expect(formField.props().htmlFor).toEqual('myDateFieldId_input')
    expect(formField.props().label).toEqual('this is my label')
  })

  it('renders the id', () => {
    const component = mountDateField({id: 'myDateFieldId'})
    expect(component.find('input').props().id).toEqual('myDateFieldId_input')
  })

  it('renders the input element', () => {
    const dateTimePicker = mountDateField({value: '05/05/2017 3:45 PM'})
      .find('DateTimePicker')
    expect(dateTimePicker.length).toEqual(1)
    expect(dateTimePicker.props().value).toEqual(new Date('05/05/2017 3:45 PM'))
  })

  it('renders the input element with a no date when value is null', () => {
    const dateTimePicker = mountDateField({value: null}).find('DateTimePicker')
    expect(dateTimePicker.length).toEqual(1)
    expect(dateTimePicker.props().value).toEqual(null)
  })

  it('calls parent onChange with date string when DateTimePicker calls onChange', () => {
    const onChange = jasmine.createSpy('onChange')
    const dateTimePicker = mountDateField({onChange}).find('DateTimePicker')
    const date = new Date()
    dateTimePicker.props().onChange(date)
    expect(onChange).toHaveBeenCalledWith(date.toISOString())
  })

  it('does not render a required date field', () => {
    const component = mountDateField()
    const formField = component.find('FormField')
    expect(formField.props().required).toEqual(undefined)
    expect(component.find('input').prop('required')).toEqual(undefined)
    expect(component.find('input').prop('aria-required')).toEqual(undefined)
  })

  it('can render properly without an onBlur prop', () => {
    const component = mountDateField({onBlur: null})
    const dateTimePicker = component.find('DateTimePicker')
    expect(() => { dateTimePicker.props().onBlur({target: {value: ''}}) })
      .not.toThrow(new TypeError('onBlur is not a function'))
  })

  describe('when passed an onBlur function', () => {
    let onBlur
    let dateTimePicker

    beforeEach(() => {
      onBlur = jasmine.createSpy('onBlur')
      dateTimePicker = mountDateField({onBlur}).find('DateTimePicker')
    })

    it('calls the passed function with a value', () => {
      const event = {target: {value: '12/31/1999 12:59 PM'}}
      dateTimePicker.props().onBlur(event)
      expect(onBlur).toHaveBeenCalledWith('1999-12-31T19:59:00.000Z')
    })

    it('calls the passed function with null if the value is empty', () => {
      const event = {target: {value: ''}}
      dateTimePicker.props().onBlur(event)
      expect(onBlur).toHaveBeenCalledWith(null)
    })
  })

  it('renders a required date field when required', () => {
    const formField = mountDateField({required: true})
      .find('FormField')
    expect(formField.props().required).toEqual(true)
  })

  it('renders date time placeholder', () => {
    const dateTimePicker = mountDateField({}).find('DateTimePicker')
    expect(dateTimePicker.props().placeholder).toEqual(
      'MM/DD/YYYY HH:MM AM/PM'
    )
  })

  it('renders date placeholder when has time is false', () => {
    const dateTimePicker = mountDateField({hasTime: false})
      .find('DateTimePicker')
    expect(dateTimePicker.props().placeholder).toEqual('MM/DD/YYYY')
  })

  it('renders form field errors', () => {
    const errors = ['Error 1', 'Error 2']
    const formField = renderDateField({errors}).find('FormField')
    expect(formField.props().errors).toEqual([
      'Error 1',
      'Error 2',
    ])
  })

  it('displays with the expected format', () => {
    const input = mountDateField({value: '2017-05-15T16:00:00.000Z'})
      .find('input')
    expect(input.props().value).toEqual('05/15/2017 9:00 AM')
  })

  it('passes the min and max props down to the DateTimePicker', () => {
    const min = new Date('2007-06-15')
    const max = new Date('2008-08-23')
    const dateTimePicker = mountDateField({min, max}).find('DateTimePicker')
    expect(dateTimePicker.props().max).toBe(max)
    expect(dateTimePicker.props().min).toBe(min)
  })

  it('displays calendar by default', () => {
    const dateTimePicker = mountDateField({}).find('DateTimePicker')
    expect(dateTimePicker.props().calendar).toEqual(true)
    expect(dateTimePicker.props().format).toEqual('MM/DD/YYYY h:mm A')
    expect(dateTimePicker.props().placeholder).toEqual('MM/DD/YYYY HH:MM AM/PM')
  })

  it('does not display calendar when hasCalendar is false', () => {
    const dateTimePicker = mountDateField({hasCalendar: false}).find('DateTimePicker')
    expect(dateTimePicker.props().calendar).toEqual(false)
    expect(dateTimePicker.props().format).toEqual('MM/DD/YYYY h:mm A')
    expect(dateTimePicker.props().placeholder).toEqual('MM/DD/YYYY HH:MM AM/PM')
  })

  it('displays date only when has time is false', () => {
    const input = mountDateField({
      hasTime: false, value: '2017-05-15T16:00:00.000Z',
    }).find('input')
    expect(input.props().value).toEqual('05/15/2017')
  })

  describe('when value is null, emptystring, or undefined', () => {
    describe('with time', () => {
      [null, '', undefined].map((value) => {
        it(`with ${value} has a blank as value`, () => {
          const input = mountDateField({value}).find('input')
          expect(input.props().value).toEqual('')
        })
      })
    })

    describe('without time', () => {
      [null, '', undefined].map((value) => {
        it(`with ${value} has a blank as value`, () => {
          const input = mountDateField({value, hasTime: false}).find('input')
          expect(input.props().value).toEqual('')
        })
      })
    })
  })

  it('handles null changes to dates (value deleted)', () => {
    const onChange = jasmine.createSpy('onChange')
    const input = mountDateField({value: '123', onChange}).find('input')
    const event = {target: {value: null}}
    input.simulate('change', event)
    input.simulate('blur', event)
    expect(onChange.calls.mostRecent().args[0]).toEqual(null)
  })

  it('parses dates with no time when hasTime is false', () => {
    const dates = [
      '1/1/15',
      '01/1/15',
      '1/01/15',
      '01/01/2015',
      '1-1-15',
      '01-1-15',
      '1-01-15',
      '01-01-15',
      '1-01-2015',
      '1-1 15',
      '010115',
    ]
    dates.map((value) => {
      const onChange = jasmine.createSpy('onChange')
      const input = mountDateField({value: '123', hasTime: false, onChange}).find('input')
      input.simulate('change', {target: {value}})
      input.simulate('blur', {target: {value}})
      expect(onChange.calls.mostRecent().args[0]).toEqual('2015-01-01')
    })
  })

  it('parses dates with times when hasTime is true', () => {
    const dates = [
      '1-01-15 2:00 PM',
      '1-1-15 2:00 PM',
      '01-01-15 2:00 PM',
      '1-1-2015 02:00 PM',
      '1/01/15 2:00 PM',
      '01/01/15 2:00 PM',
      '1/01/2015 02:00 PM',
      '1-1-15 2 PM',
      '1-1-15 1400',
      '1-1-15 14',
      '010120151400',
      '010120152p',
      '1-1 15 14',
    ]
    dates.map((value) => {
      const onChange = jasmine.createSpy('onChange')
      const input = mountDateField({value: '123', hasTime: true, onChange}).find('input')
      input.simulate('change', {target: {value}})
      input.simulate('blur', {target: {value}})
      expect(onChange.calls.mostRecent().args[0]).toEqual('2015-01-01T21:00:00.000Z')
    })
  })
})
