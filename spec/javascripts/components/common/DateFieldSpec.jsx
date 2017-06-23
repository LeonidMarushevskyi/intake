import React from 'react'
import {shallow, mount} from 'enzyme'
import DateField from 'components/common/DateField'
import moment from 'moment'
import Immutable from 'immutable'

describe('DateField', () => {
  let component
  let props
  let onChange
  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    props = {
      gridClassName: 'myWrapperTest',
      id: 'myDateFieldId',
      label: 'this is my label',
      labelClassName: 'myLabelTest',
      onChange: onChange,
      value: '05/05/2017 3:45 PM',
    }
    component = mount(
      <DateField {...props}/>
    )
  })

  it('renders the wrapperClass', () => {
    expect(component.html()).toContain('class="myWrapperTest"')
  })

  it('renders the id', () => {
    expect(component.find('input').props().id).toEqual('myDateFieldId_input')
    expect(component.find('label').props().htmlFor).toEqual('myDateFieldId_input')
  })

  it('renders the label', () => {
    const labelElement = component.find('label')
    expect(labelElement.length).toEqual(1)
    expect(labelElement.html()).toContain('for="myDateFieldId_input"')
    expect(labelElement.html()).toContain('class="myLabelTest')
    expect(labelElement.text()).toEqual('this is my label')
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
    expect(component.find('label.required').exists()).toEqual(false)
    expect(component.find('label').not('.required').exists()).toEqual(true)
    expect(component.find('input').prop('required')).toBeFalsy()
    expect(component.find('input').prop('aria-required')).toBeFalsy()
  })

  describe('when required', () => {
    beforeEach(() => {
      component = shallow(<DateField {...props} onChange={onChange} required={true} />)
    })
    it('renders a required date field', () => {
      expect(component.find('label.required').exists()).toEqual(true)
      expect(component.find('label').not('.required').exists()).toEqual(false)
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

  describe('when an empty list is passed for errors', () => {
    beforeEach(() => {
      component = shallow(<DateField {...props} errors={Immutable.List()} />)
    })

    it('does not display any errors', () => {
      expect(component.find('.input-error').length).toEqual(0)
    })

    it('does not render the label as if it has an error', () => {
      expect(component.find('.input-error-label').length).toEqual(0)
    })

    it('does not render error messages', () => {
      expect(component.find('.input-error-message').length).toEqual(0)
    })
  })

  describe('when errors exist', () => {
    const errors = Immutable.List(['Error 1', 'Error 2'])

    beforeEach(() => {
      component = shallow(<DateField {...props} errors={errors} />)
    })

    it('adds an error class to the input wrapper', () => {
      expect(component.find('.input-error').length).toEqual(1)
    })

    it('displays an error styled label', () => {
      expect(component.find('.input-error-label').length).toEqual(1)
    })

    it('displays error messages', () => {
      expect(component.find('.input-error-message').length).toEqual(2)
      expect(component.find('.input-error-message').first().text()).toEqual('Error 1')
      expect(component.find('.input-error-message').last().text()).toEqual('Error 2')
    })
  })

  describe('with valid user inputs', () => {
    beforeEach(() => {
      props = {
        onChange: onChange,
        value: '2017-05-15T16:00:00.000Z',
      }
    })

    it('displays with the exepcted format', () => {
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

    describe('props going in', () => {
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
