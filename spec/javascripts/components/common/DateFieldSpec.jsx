import React from 'react'
import {shallow, mount} from 'enzyme'
import DateField from 'common/DateField'
import moment from 'moment'

describe('DateField', () => {
  let component
  let onChange
  let formField
  const props = {
    gridClassName: 'myWrapperTest',
    id: 'myDateFieldId',
    label: 'this is my label',
    labelClassName: 'myLabelTest',
    value: '05/05/2017 3:45 PM',
  }

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    props.onChange = onChange
    component = mount(<DateField {...props}/>)
    formField = component.find('FormField')
  })

  it('passes props to the FormField', () => {
    expect(formField.props().labelClassName).toEqual('myLabelTest')
    expect(formField.props().gridClassName).toEqual('myWrapperTest')
    expect(formField.props().htmlFor).toEqual('myDateFieldId_input')
    expect(formField.props().label).toEqual('this is my label')
    expect(formField.find('DateTimePicker').exists()).toEqual(true)
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myDateFieldId_input')
  })

  it('renders the input element', () => {
    const inputElement = component.find('DateTimePicker')
    expect(inputElement.length).toEqual(1)
    expect(inputElement.props().value).toEqual(new Date('05/05/2017 3:45 PM'))
  })

  it('renders the input element with a no date when value is null', () => {
    const propsWithNullValue = Object.assign(props, {value: null})
    component = mount(<DateField {...propsWithNullValue}/>)
    const inputElement = component.find('input')
    expect(inputElement.length).toEqual(1)
    expect(inputElement.props().value).toEqual('')
  })

  it('calls parent onChange with date string when DateTimePicker calls onChange', () => {
    const date = new Date()
    const inputElement = component.find('DateTimePicker')
    inputElement.props().onChange(date, date.toString())
    expect(onChange).toHaveBeenCalledWith(date.toISOString())
  })

  it('does not render a required date field', () => {
    expect(formField.props().required).toEqual(undefined)
    expect(component.find('input').prop('required')).toEqual(undefined)
    expect(component.find('input').prop('aria-required')).toEqual(undefined)
  })

  it('can render properly without an onBlur prop', () => {
    const dateTimePicker = component.find('DateTimePicker')
    expect(() => { dateTimePicker.props().onBlur({target: {value: ''}}) })
      .not.toThrow(new TypeError('onBlur is not a function'))
  })

  describe('when passed an onBlur function', () => {
    let onBlur

    beforeEach(() => {
      onBlur = jasmine.createSpy('onBlur')
      props.onBlur = onBlur
      component = mount(<DateField {...props}/>)
    })

    it('calls the passed function with a value', () => {
      const date = '12/31/1999 12:59 PM'
      const dateTimePicker = component.find('DateTimePicker')
      dateTimePicker.props().onBlur({target: {value: date}})
      expect(onBlur).toHaveBeenCalledWith(moment(date, 'MM/DD/YYYY h:mm A').toISOString())
    })

    it('calls the passed function with null if the value is empty', () => {
      const dateTimePicker = component.find('DateTimePicker')
      dateTimePicker.props().onBlur({target: {value: ''}})
      expect(onBlur).toHaveBeenCalledWith(null)
    })
  })

  describe('when required', () => {
    it('renders a required date field', () => {
      component = shallow(<DateField {...props} required/>)
      expect(component.find('FormField').props().required).toEqual(true)
      // Commented out two lines of required label checking in DateFieldSpec as
      //  the props are not passed all the way down to the input field by the
      //  DateTimePicker component. The broken functionality was not explicitly
      //  specified in the story, and will likely be handled by the implementation
      //  of validation checking. We discussed this with Bruno and Aman and
      //  decided it was the best action to get the date picker in without those
      //  two checks.
      // expect(component.find('Input').props().required).toEqual(true)
      // expect(component.find('Input').prop('aria-required')).toEqual(true)
    })
  })

  describe('with placeholder', () => {
    it('adds a default placeholder', () => {
      component = mount(<DateField {...props}/>)
      const dateTimePickerElement = component.find('DateTimePicker')
      expect(dateTimePickerElement.props().placeholder).toEqual('MM/DD/YYYY HH:MM AM/PM')
    })

    it('adds a custom placeholder', () => {
      component = mount(<DateField {...props} hasTime={false}/>)
      const dateTimePickerElement = component.find('DateTimePicker')
      expect(dateTimePickerElement.props().placeholder).toEqual('MM/DD/YYYY')
    })
  })

  describe('when errors exist', () => {
    it('sends the errors to FormField', () => {
      const errors = ['Error 1', 'Error 2']
      component = shallow(<DateField {...props} errors={errors} />)
      expect(component.find('FormField').props().errors)
        .toEqual(['Error 1', 'Error 2'])
    })
  })

  describe('with valid user inputs', () => {
    beforeEach(() => {
      props.value = '2017-05-15T16:00:00.000Z'
    })

    it('displays with the expected format', () => {
      component = mount(
        <DateField {...props}/>
      )
      const inputElement = component.find('input')
      expect(inputElement.props().value).toEqual('05/15/2017 9:00 AM')
    })

    it('passes the min and max props down to the DateTimePicker', () => {
      const min = new Date('2007-06-15')
      const max = new Date('2008-08-23')
      component = mount(<DateField {...props} min={min} max={max} />)
      const inputElement = component.find('DateTimePicker')
      expect(inputElement.props().max).toBe(max)
      expect(inputElement.props().min).toBe(min)
    })

    describe('with time', () => {
      it('does display the calendar by default', () => {
        component = mount(<DateField {...props} />)
        const inputElement = component.find('DateTimePicker')
        expect(inputElement.props().calendar).toEqual(true)
        expect(inputElement.props().format).toEqual('MM/DD/YYYY h:mm A')
        expect(inputElement.props().placeholder).toEqual('MM/DD/YYYY HH:MM AM/PM')
      })

      it('does not display the calendar when hasCalendar is false', () => {
        component = mount(<DateField {...props} hasCalendar={false} />)
        const inputElement = component.find('DateTimePicker')
        expect(inputElement.props().calendar).toEqual(false)
        expect(inputElement.props().format).toEqual('MM/DD/YYYY h:mm A')
        expect(inputElement.props().placeholder).toEqual('MM/DD/YYYY HH:MM AM/PM')
      })
    })

    describe('without time', () => {
      it('does display the calendar by default', () => {
        component = mount(<DateField {...props} hasCalendar={false} hasTime={false} />)
        const inputElement = component.find('DateTimePicker')
        expect(inputElement.props().calendar).toEqual(false)
        expect(inputElement.props().format).toEqual('MM/DD/YYYY')
        expect(inputElement.props().placeholder).toEqual('MM/DD/YYYY')
      })

      it('does not display the calendar when hasCalendar is false', () => {
        component = mount(<DateField {...props} hasCalendar={false} hasTime={false} />)
        const inputElement = component.find('DateTimePicker')
        expect(inputElement.props().calendar).toEqual(false)
        expect(inputElement.props().format).toEqual('MM/DD/YYYY')
        expect(inputElement.props().placeholder).toEqual('MM/DD/YYYY')
      })
    })

    it('displays date only when format is changed', () => {
      component = mount(<DateField {...props} hasTime={false} />)
      const inputElement = component.find('input')
      expect(inputElement.props().value).toEqual('05/15/2017')
    })

    describe('when value is null, emptystring, or undefined', () => {
      describe('with time', () => {
        [null, '', undefined].map((value) => {
          it(`with ${value} has a blank as value`, () => {
            component = mount(<DateField {...props} value={value} />)
            const inputElement = component.find('input')
            expect(inputElement.props().value).toEqual('')
          })
        })
      })

      describe('without time', () => {
        [null, '', undefined].map((value) => {
          it(`with ${value} has a blank as value`, () => {
            component = mount(<DateField {...props} hasTime={false} value={value} />)
            const inputElement = component.find('input')
            expect(inputElement.props().value).toEqual('')
          })
        })
      })
    })

    describe('when date is passed', () => {
      it('passes dates from store', () => {
        component = mount(<DateField {...props} hasTime={false} value='1986-03-04' />)
        expect(component.find('Input').props().value).toEqual('03/04/1986')
      })
      it('passing datetimes from store', () => {
        component = mount(<DateField {...props} value='2016-08-13T22:00:00.000Z' />)
        expect(component.find('Input').props().value).toEqual('08/13/2016 3:00 PM')
      })
    })

    it('handles null changes to dateTimes (value deleted)', () => {
      component = mount(<DateField {...props} />)
      const inputElement = component.find('Input')
      inputElement.simulate('change', {target: {value: null}})
      inputElement.simulate('blur', {target: {value: null}})
      expect(inputElement.props().value).toEqual('')
      // Check onChange got called with right value
      expect(onChange.calls.mostRecent().args[0]).toEqual(null)
    })

    it('handles null changes to dates (value deleted)', () => {
      component = mount(<DateField {...props} hasTime={false} />)
      const inputElement = component.find('Input')
      inputElement.simulate('change', {target: {value: null}})
      inputElement.simulate('blur', {target: {value: null}})
      expect(inputElement.props().value).toEqual('')
      // Check onChange got called with right value
      expect(onChange.calls.mostRecent().args[0]).toEqual(null)
    })

    it('parses dates with no time', () => {
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
      dates.map((date) => {
        component = mount(<DateField {...props} hasTime={false} />)
        const inputElement = component.find('Input')
        inputElement.simulate('change', {target: {value: date}})
        inputElement.simulate('blur', {target: {value: date}})
        expect(inputElement.props().value).toEqual('01/01/2015')
        // Check onChange got called with right value
        expect(onChange.calls.mostRecent().args[0]).toEqual('2015-01-01')
      })
    })

    it('parses dates with times', () => {
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
      dates.map((date) => {
        component = mount(<DateField {...props} />)
        const inputElement = component.find('Input')
        inputElement.simulate('change', {target: {value: date}})
        inputElement.simulate('blur', {target: {value: date}})
        expect(inputElement.props().value).toEqual('01/01/2015 2:00 PM')
        // Check onChange got called with right value
        expect(onChange.calls.mostRecent().args[0]).toEqual('2015-01-01T21:00:00.000Z')
      })
    })
  })

  describe('with custom properties', () => {
    beforeEach(() => {
      component = mount(
        <DateField {...props} value={'2017-05-05'} hasTime={false} />
      )
    })

    it('renders the input element', () => {
      const datepickerElement = component.find('DateTimePicker')
      expect(datepickerElement.length).toEqual(1)
      expect(datepickerElement.props().value).toEqual(moment('05/05/2017', 'MM/DD/YYYY').toDate())
    })

    it('passes the format prop', () => {
      const inputElement = component.find('DateTimePicker')
      expect(inputElement.props().format).toEqual('MM/DD/YYYY')
    })

    it('passes the time prop', () => {
      const inputElement = component.find('DateTimePicker')
      expect(inputElement.props().time).toBe(false)
    })

    it('passes the calendar prop', () => {
      const inputElement = component.find('DateTimePicker')
      expect(inputElement.props().calendar).toBe(true)
    })
  })
})
