import ContactForm from 'investigations/ContactForm'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('ContactForm', () => {
  function renderContact({
    investigationId = 'ABC123',
    actions = {},
    startedAt = null,
    communicationMethod = null,
    location = null,
    status = null,
    note = null,
    purpose = null,
    errors = {},
    statuses = [],
    purposes = [],
    communicationMethods = [],
    locations = [],
    inPersonCode = '',
    officeLocationCode = '',
    people = [],
    valid = false,
  }) {
    const props = {
      investigationId,
      actions,
      startedAt,
      communicationMethod,
      location,
      status,
      note,
      purpose,
      statuses,
      purposes,
      communicationMethods,
      locations,
      errors,
      inPersonCode,
      officeLocationCode,
      people,
      valid,
    }
    return shallow(<ContactForm {...props} />)
  }

  it('displays the investigation Id in the header', () => {
    const component = renderContact({investigationId: 'ABCD1234'})
    const header = component.find('.card-header')
    expect(header.text()).toEqual('New Contact - Investigation ABCD1234')
  })

  it('displays the started at datetime picker', () => {
    const component = renderContact({
      startedAt: '2016-08-11T18:24:22.157Z',
      errors: {started_at: ['Things are wrong!']},
    })
    const startedAt = component.find('DateField')
    expect(startedAt.props().errors).toEqual(['Things are wrong!'])
    expect(startedAt.props().value).toEqual('2016-08-11T18:24:22.157Z')
  })

  it('changing started at fires setField', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderContact({actions: {setField}, startedAt: ''})
    component.find('DateField').simulate('change', '123')
    expect(setField).toHaveBeenCalledWith('started_at', '123')
  })

  it('blurring started at fires touchField', () => {
    const touchField = jasmine.createSpy('touchField')
    const component = renderContact({actions: {touchField}, startedAt: ''})
    component.find('DateField').simulate('blur')
    expect(touchField).toHaveBeenCalledWith('started_at')
  })

  it('displays the status dropdown', () => {
    const component = renderContact({
      status: 'S',
      statuses: [
        {code: 'S', value: 'Scheduled'},
        {code: 'A', value: 'Attempted'},
        {code: 'C', value: 'Completed'},
      ],
      errors: {status: ['This could be wrong!']},
    })
    const statusField = component.find("SelectField[id='status']")
    expect(statusField.props().value).toEqual('S')
    expect(statusField.childAt(0).props().value).toEqual('')
    expect(statusField.childAt(1).props().value).toEqual('S')
    expect(statusField.childAt(2).props().value).toEqual('A')
    expect(statusField.childAt(3).props().value).toEqual('C')
    expect(statusField.props().errors).toEqual(['This could be wrong!'])
  })

  it('changing status fires setField', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderContact({actions: {setField}, status: ''})
    component.find("SelectField[id='status']").simulate('change', {target: {value: 'C'}})
    expect(setField).toHaveBeenCalledWith('status', 'C')
  })

  it('blurring status fires touchField', () => {
    const touchField = jasmine.createSpy('touchField')
    const component = renderContact({actions: {touchField}, status: ''})
    component.find("SelectField[id='status']").simulate('blur')
    expect(touchField).toHaveBeenCalledWith('status')
  })

  it('displays the communication method dropdown', () => {
    const component = renderContact({
      communicationMethod: '2',
      communicationMethods: [
        {code: '1', value: 'Carrier Pigeon'},
        {code: '2', value: 'Smoke Signal'},
        {code: '3', value: 'Morse Code'},
      ], errors: {
        communication_method: ['Not valid'],
      },
    })
    const communicationMethodSelect = component.find("SelectField[id='communication_method']")
    expect(communicationMethodSelect.exists()).toEqual(true)
    expect(communicationMethodSelect.props().value).toEqual('2')
    expect(communicationMethodSelect.props().errors).toEqual(['Not valid'])
    expect(communicationMethodSelect.childAt(0).props().value).toEqual('')
    expect(communicationMethodSelect.childAt(1).props().value).toEqual('1')
    expect(communicationMethodSelect.childAt(1).text()).toEqual('Carrier Pigeon')
    expect(communicationMethodSelect.childAt(2).props().value).toEqual('2')
    expect(communicationMethodSelect.childAt(2).text()).toEqual('Smoke Signal')
    expect(communicationMethodSelect.childAt(3).props().value).toEqual('3')
    expect(communicationMethodSelect.childAt(3).text()).toEqual('Morse Code')
  })

  it('changing communication method fires setField with the proper parameters', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderContact({actions: {setField}})
    const communicationMethodSelect = component.find("SelectField[id='communication_method']")
    communicationMethodSelect.simulate('change', {target: {value: '1'}})
    expect(setField).toHaveBeenCalledWith('communication_method', '1')
  })

  it("changing communication method to anything but 'in person code' sets location to 'office location code'", () => {
    const setField = jasmine.createSpy('setField')
    const officeLocationCode = 'officeLocationCode'
    const inPersonCode = 'inPersonCode'
    const component = renderContact({inPersonCode, officeLocationCode, actions: {setField}})
    const communicationMethodSelect = component.find("SelectField[id='communication_method']")
    communicationMethodSelect.simulate('change', {target: {value: 'not inPersonCode'}})
    expect(setField).toHaveBeenCalledWith('communication_method', 'not inPersonCode')
    expect(setField).toHaveBeenCalledWith('location', officeLocationCode)
  })

  it("changing communication method to 'in person code' resets location", () => {
    const setField = jasmine.createSpy('setField')
    const inPersonCode = 'inPersonCode'
    const component = renderContact({inPersonCode, actions: {setField}})
    const communicationMethodSelect = component.find("SelectField[id='communication_method']")
    communicationMethodSelect.simulate('change', {target: {value: inPersonCode}})
    expect(setField).toHaveBeenCalledWith('communication_method', inPersonCode)
    expect(setField).toHaveBeenCalledWith('location', null)
  })

  it('blurring communication method fires touchField with the proper parameter', () => {
    const touchField = jasmine.createSpy('touchField')
    const component = renderContact({actions: {touchField}})
    const communicationMethodSelect = component.find("SelectField[id='communication_method']")
    communicationMethodSelect.simulate('blur')
    expect(touchField).toHaveBeenCalledWith('communication_method')
  })

  it('does not display the location dropdown when the communication method is not in person', () => {
    const component = renderContact({inPersonCode: '2', communicationMethod: '3'})
    const locationSelect = component.find("SelectField[id='location']")
    expect(locationSelect.exists()).toEqual(false)
  })

  it('displays the location dropdown when the communication method is in person', () => {
    const inPersonCode = '2'
    const component = renderContact({
      inPersonCode,
      communicationMethod: inPersonCode,
      location: '2',
      locations: [
        {code: '1', value: 'On a mountain'},
        {code: '2', value: 'In space'},
        {code: '3', value: 'Under an umbrella'},
      ], errors: {
        location: ['Not valid'],
      },
    })
    const locationSelect = component.find("SelectField[id='location']")
    expect(locationSelect.exists()).toEqual(true)
    expect(locationSelect.props().value).toEqual('2')
    expect(locationSelect.props().errors).toEqual(['Not valid'])
    expect(locationSelect.childAt(0).props().value).toEqual('')
    expect(locationSelect.childAt(0).text()).toEqual('')
    expect(locationSelect.childAt(1).props().value).toEqual('1')
    expect(locationSelect.childAt(1).text()).toEqual('On a mountain')
    expect(locationSelect.childAt(2).props().value).toEqual('2')
    expect(locationSelect.childAt(2).text()).toEqual('In space')
    expect(locationSelect.childAt(3).props().value).toEqual('3')
    expect(locationSelect.childAt(3).text()).toEqual('Under an umbrella')
  })

  it('changing location calls setField with the proper parameters', () => {
    const setField = jasmine.createSpy('setField')
    const inPersonCode = '2'
    const component = renderContact({
      inPersonCode,
      actions: {setField},
      communicationMethod: inPersonCode,
    })
    const locationSelect = component.find("SelectField[id='location']")
    locationSelect.simulate('change', {target: {value: '4'}})
    expect(setField).toHaveBeenCalledWith('location', '4')
  })

  it('blurring location calls touchField with the proper parameters', () => {
    const touchField = jasmine.createSpy('touchField')
    const inPersonCode = '2'
    const component = renderContact({
      inPersonCode,
      actions: {touchField},
      communicationMethod: inPersonCode,
    })
    const locationSelect = component.find("SelectField[id='location']")
    locationSelect.simulate('blur')
    expect(touchField).toHaveBeenCalledWith('location')
  })

  it('displays people present', () => {
    const people = [
      {first_name: 'Ferris', last_name: 'Bueller'},
      {first_name: 'Cameron', last_name: 'Fry'},
    ]
    const component = renderContact({people})
    expect(component.html()).toContain('Ferris Bueller')
    expect(component.html()).toContain('Cameron Fry')
  })

  it('displays note', () => {
    const component = renderContact({note: 'This is a simple contact note'})
    const noteField = component.find('textarea')
    expect(noteField.text()).toContain('This is a simple contact note')
  })

  it('changing note fires setField', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderContact({
      actions: {setField}, note: 'This is a simple contact note',
    })
    component.find('textarea').simulate('change', {target: {value: 'This is a new note'}})
    expect(setField).toHaveBeenCalledWith('note', 'This is a new note')
  })

  it('displays the purpose dropdown', () => {
    const component = renderContact({
      purpose: '1',
      purposes: [
        {code: '1', value: 'Investigate Referral'},
        {code: '2', value: 'Consult with Collateral'},
        {code: '3', value: 'Consult with Staff Person'},
      ],
      errors: {purpose: ['This is definately wrong!']},
    })
    const purposeField = component.find("SelectField[id='purpose']")
    expect(purposeField.props().value).toEqual('1')
    expect(purposeField.childAt(0).props().value).toEqual('')
    expect(purposeField.childAt(1).props().value).toEqual('1')
    expect(purposeField.childAt(2).props().value).toEqual('2')
    expect(purposeField.childAt(3).props().value).toEqual('3')
    expect(purposeField.props().errors).toEqual(['This is definately wrong!'])
  })

  it('changing purpose fires setField', () => {
    const setField = jasmine.createSpy('setField')
    const component = renderContact({actions: {setField}, purpose: ''})
    component.find("SelectField[id='purpose']").simulate('change', {target: {value: '3'}})
    expect(setField).toHaveBeenCalledWith('purpose', '3')
  })

  it('blurring purpose fires touchField', () => {
    const touchField = jasmine.createSpy('touchField')
    const component = renderContact({actions: {touchField}, purpose: ''})
    component.find("SelectField[id='purpose']").simulate('blur')
    expect(touchField).toHaveBeenCalledWith('purpose')
  })

  it('displays the save button', () => {
    const component = renderContact({})
    const saveButton = component.find('button')
    expect(saveButton.text()).toContain('Save')
    expect(saveButton.props().type).toEqual('submit')
  })

  describe('clicking save', () => {
    let create
    const event = jasmine.createSpyObj('event', ['preventDefault'])
    beforeEach(() => {
      create = jasmine.createSpy('create')
    })

    it('when contact is valid creates a contact', () => {
      const component = renderContact({
        valid: true,
        investigationId: '123',
        startedAt: '2016-08-11T18:24:22.157Z',
        status: 'S',
        communicationMethod: '654',
        location: '432',
        note: 'This is a new note',
        purpose: '1',
        actions: {create},
      })
      component.find('form').simulate('submit', event)
      expect(create).toHaveBeenCalledWith({
        investigation_id: '123',
        started_at: '2016-08-11T18:24:22.157Z',
        communication_method: '654',
        location: '432',
        status: 'S',
        note: 'This is a new note',
        purpose: '1',
        people: [],
      })
    })

    describe('when contact is invalid', () => {
      let touchAllFields

      beforeEach(() => {
        touchAllFields = jasmine.createSpy('touchAllFields')
        const component = renderContact({
          valid: false,
          investigationId: '123',
          startedAt: '2016-08-11T18:24:22.157Z',
          status: 'S',
          communicationMethod: '654',
          location: '432',
          note: 'This is a new note',
          purpose: '1',
          actions: {create, touchAllFields},
        })
        component.find('form').simulate('submit', event)
      })

      it('does not create a contact', () => {
        expect(create).not.toHaveBeenCalled()
      })

      it('touches all contact fields to display all validations', () => {
        expect(touchAllFields).toHaveBeenCalled()
      })
    })
  })

  it('calls build when the component mounts', () => {
    const build = jasmine.createSpy('build')
    mount(
      <ContactForm
        investigationId='ABC123'
        actions={{build}}
        contact={{}}
        statuses={[]}
        purposes={[]}
        communicationMethods={[]}
        locations={[]}
        people={[]}
      />
    )
    expect(build).toHaveBeenCalledWith({investigation_id: 'ABC123'})
  })
})
