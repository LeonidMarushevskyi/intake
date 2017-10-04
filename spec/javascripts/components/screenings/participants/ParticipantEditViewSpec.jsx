import Immutable from 'immutable'
import ParticipantEditView from 'screenings/ParticipantEditView'
import React from 'react'
import {mount, shallow} from 'enzyme'

describe('ParticipantEditView', () => {
  let participantId
  let component
  let onChange
  let onCancel
  let onDobBlur
  let onSave

  const requiredParticipantProps = {
    roles: [],
    legacy_descriptor: {},
    languages: [],
  }

  beforeEach(() => {
    onChange = jasmine.createSpy('onChange')
    onCancel = jasmine.createSpy('onCancel')
    onDobBlur = jasmine.createSpy('onDobBlur')
    onSave = jasmine.createSpy('onSave')
  })

  describe('rendering edit view', () => {
    beforeEach(() => {
      participantId = '199'
      const participant = Immutable.fromJS({
        id: participantId,
        first_name: 'Lisa',
        middle_name: 'Marie',
        last_name: 'Simpson',
        name_suffix: 'phd',
        date_of_birth: '2016-12-31',
        gender: 'female',
        languages: [],
        ssn: 'ssn-1',
        roles: [],
        legacy_descriptor: {
          legacy_ui_id: '123-456-789',
          legacy_table_description: 'Client',
        },
      })
      component = shallow(
        <ParticipantEditView
          participant={participant}
          onChange={onChange}
          onCancel={onCancel}
          onSave={onSave}
        />
      )
    })

    it('renders the participant legacy id and table', () => {
      expect(component.text()).toContain('Client ID 123-456-789 in CWS-CMS')
    })

    it('renders the participant legacy table when there is no id', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: participantId,
        first_name: 'Lisa',
        last_name: 'Simpson',
        legacy_descriptor: {
          legacy_table_description: 'Client',
        },
      })
      component = shallow(<ParticipantEditView participant={participant} />)
      expect(component.text()).toContain('Client in CWS-CMS')
    })

    it('renders properly when there is no legacy id nor legacy table', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: participantId,
        first_name: 'Lisa',
        last_name: 'Simpson',
        legacy_descriptor: {},
      })
      component = shallow(<ParticipantEditView participant={participant} />)
      expect(component.text()).not.toContain('in CWS-CMS')
    })

    it('renders the first name field', () => {
      const firstNameField = component.find('InputField[label="First Name"]')
      expect(firstNameField.props().value).toEqual('Lisa')
      expect(firstNameField.props().maxLength).toEqual('64')
    })

    it('renders the middle name field', () => {
      const middleNameField = component.find('InputField[label="Middle Name"]')
      expect(middleNameField.props().value).toEqual('Marie')
      expect(middleNameField.props().maxLength).toEqual('64')
    })

    it('renders the last name field', () => {
      const lastNameField = component.find('InputField[label="Last Name"]')
      expect(lastNameField.props().value).toEqual('Simpson')
      expect(lastNameField.props().maxLength).toEqual('64')
    })

    it('renders the suffix field', () => {
      expect(component.find('SelectField[label="Suffix"]').props().value)
        .toEqual('phd')
    })

    it('renders the DoB field', () => {
      expect(component.find('DateField[label="Date of birth"]').props().value)
        .toEqual('2016-12-31')
    })

    it('renders the approximate age fields', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: participantId,
        approximate_age: '10',
        approximate_age_units: 'Months',
      })
      component = shallow(<ParticipantEditView participant={participant} />)

      expect(component.find('InputField[label="Approximate Age"]').props().value)
        .toEqual('10')
      expect(component.find('select[id="approximate_age_units"]').props().value)
        .toEqual('Months')
    })

    it('renders the gender field', () => {
      expect(component.find('SelectField[label="Gender"]').props().value)
        .toEqual('female')
    })

    it('renders the SSN field', () => {
      expect(component.find('MaskedInputField[label="Social security number"]').props().placeholder)
        .toEqual('___-__-____')
      expect(component.find('MaskedInputField[label="Social security number"]').props().value)
        .toEqual('ssn-1')
    })

    describe('ethnicity', () => {
      it('renders the EthnicityEditView', () => {
        expect(component.find('EthnicityEditView').length).toEqual(1)
        expect(component.find('EthnicityEditView').props().id).toEqual('participant-199')
      })

      it('change event calls onChange with ethnicity', () => {
        const ethnicity = Immutable.Map({hispanic_latino_origin: 'Yes'})
        component.find('EthnicityEditView')
          .simulate('change', ethnicity)
        expect(onChange).toHaveBeenCalledWith(['ethnicity'], ethnicity)
      })
    })

    it('renders the save button', () => {
      expect(component.find('.btn.btn-primary').text()).toEqual('Save')
    })

    it('when user hits save button', () => {
      const saveButton = component.find('button[children="Save"]')
      saveButton.simulate('click')
      expect(onSave).toHaveBeenCalled()
    })

    it('fires the onChange call when a field changes', () => {
      component.find('#participant-199-ssn').simulate('change', {target: {value: '123-756-075'}})
      expect(onChange).toHaveBeenCalledWith(['ssn'], '123-756-075')
    })

    it('renders the cancel link', () => {
      expect(component.find('.btn.btn-default').text()).toEqual('Cancel')
    })

    it('when user hits cancel', () => {
      const cancelButton = component.find('button[children="Cancel"]')
      cancelButton.simulate('click')
      expect(onCancel).toHaveBeenCalled()
    })

    it('when the user edits and hits cancel', () => {
      const cancelButton = component.find('button[children="Cancel"]')
      component.find('#participant-199-ssn').simulate('change', {target: {value: '123-756-075'}})
      cancelButton.simulate('click')
      expect(onCancel).toHaveBeenCalled()
      expect(component.find('MaskedInputField[label="Social security number"]').props().value)
        .toEqual('ssn-1')
    })

    describe('languages', () => {
      it('renders the language field', () => {
        const language_container = component.find('label[htmlFor="languages"]').parent()
        expect(language_container.find('Select[multi]').length).toEqual(1)
        expect(language_container.find('Select[multi]').props().inputProps.id).toEqual('languages')
        expect(language_container.find('Select[multi]').props().value).toEqual([])
      })

      it('renders the language field after changes', () => {
        const language_container = component.find('label[htmlFor="languages"]').parent()
        const newSelectedLanguages = [
          {label: 'Farsi', value: 'farsi'},
          {label: 'English', value: 'english'},
        ]
        language_container.find('Select[multi]').simulate('change', newSelectedLanguages)
        expect(onChange).toHaveBeenCalledWith(['languages'], Immutable.List(['farsi', 'english']))
      })
    })
  })

  describe('roles', () => {
    let participantId
    let component
    let onChange

    beforeEach(() => {
      onChange = jasmine.createSpy('onChange')

      participantId = '199'
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: participantId,
        roles: [],
      })
      component = shallow(
        <ParticipantEditView
          participant={participant}
          onChange={onChange}
        />
      )
    })

    it('renders the role field', () => {
      const roles_label = component.find(`label[htmlFor="roles_${participantId}"]`)
      const roles_field = roles_label.parent().find('Select[multi]')
      expect(roles_label.length).toEqual(1)
      expect(roles_label.text()).toEqual('Role')
      expect(roles_field.length).toEqual(1)
      expect(roles_field.props().inputProps.id).toEqual(`roles_${participantId}`)
      expect(roles_field.props().value).toEqual([])
      expect(roles_field.props().options).toEqual([
        {label: 'Victim', value: 'Victim'},
        {label: 'Perpetrator', value: 'Perpetrator'},
        {label: 'Family Member', value: 'Family Member'},
        {label: 'Collateral', value: 'Collateral'},
        {label: 'Mandated Reporter', value: 'Mandated Reporter', disabled: false},
        {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: false},
        {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: false},
      ])
    })

    it('allows a user to select a role', () => {
      const newSelectedRoles = [
        {label: 'Perpetrator', value: 'Perpetrator'},
      ]
      const roles_container = component.find(`label[htmlFor="roles_${participantId}"]`).parent()
      roles_container.find('Select[multi]').simulate('Change', newSelectedRoles)
      expect(onChange).toHaveBeenCalledWith(['roles'], Immutable.List(['Perpetrator']))
    })

    describe('when a participant has an existing role', () => {
      beforeEach(() => {
        onChange = jasmine.createSpy('onChange')

        participantId = '199'
        const participant = Immutable.fromJS({
          ...requiredParticipantProps,
          id: participantId,
          roles: ['Mandated Reporter'],
        })
        component = shallow(
          <ParticipantEditView
            participant={participant}
            onChange={onChange}
          />
        )
      })

      it('disables other reporter roles when one reporter role is selected', () => {
        const expectedOptions = [
          {label: 'Victim', value: 'Victim'},
          {label: 'Perpetrator', value: 'Perpetrator'},
          {label: 'Family Member', value: 'Family Member'},
          {label: 'Collateral', value: 'Collateral'},
          {label: 'Mandated Reporter', value: 'Mandated Reporter'},
          {label: 'Non-mandated Reporter', value: 'Non-mandated Reporter', disabled: true},
          {label: 'Anonymous Reporter', value: 'Anonymous Reporter', disabled: true},
        ]
        const roles_container = component.find(`label[htmlFor="roles_${participantId}"]`).parent()
        expect(roles_container.find('Select[multi]').props().options).toEqual(expectedOptions)
      })
    })
  })

  describe('addresses', () => {
    beforeEach(() => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '199',
        first_name: 'Lisa',
        last_name: 'Simpson',
        date_of_birth: '2016-12-31',
        gender: 'female',
        ssn: 'ssn-1',
        addresses: [{}],
      })
      component = mount(
        <ParticipantEditView
          participant={participant}
          onChange={onChange}
          onCancel={onCancel}
          onSave={onSave}
        />
      )
    })

    it('renders an address edit view', () => {
      expect(component.find('AddressesEditView').length).toEqual(1)
    })

    it('calls onChange when an address is updated', () => {
      component.find('#street_address').simulate('change', {target: {value: '1234 Nowhere Lane'}})
      expect(onChange).toHaveBeenCalled()
      const address = Immutable.List([Immutable.Map({street_address: '1234 Nowhere Lane'})])
      const callParams = onChange.calls.argsFor(0)
      const fieldSeq = callParams[0]
      const value = callParams[1]
      expect(fieldSeq).toEqual(['addresses'])
      expect(Immutable.is(value, address)).toEqual(true)
    })
  })

  describe('phone numbers', () => {
    it('renders a phone number in edit view', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '199',
        first_name: 'Lisa',
        last_name: 'Simpson',
        date_of_birth: '2016-12-31',
        gender: 'female',
        ssn: 'ssn-1',
        addresses: [{}],
        phone_numbers: [{}],
      })
      component = shallow(<ParticipantEditView participant={participant} />)

      expect(component.find('PhoneNumbersEditView').length).toEqual(1)
    })
  })

  describe('social security number (ssn)', () => {
    it('renders ssn in edit view', () => {
      const participant = Immutable.fromJS({
        ...requiredParticipantProps,
        id: '199',
        first_name: 'Lisa',
        last_name: 'Simpson',
        date_of_birth: '2016-12-31',
        gender: 'female',
        ssn: '123456789',
        addresses: [{}],
        phone_numbers: [{}],
      })
      component = shallow(<ParticipantEditView participant={participant} />)

      expect(component.find('MaskedInputField[label="Social security number"]').props().mask)
        .toEqual('111-11-1111')
    })
  })

  describe('races', () => {
    const races = Immutable.fromJS([
      {race: 'White', race_detail: 'Middle Eastern'}, {race: 'Asian', race_detail: 'Cambodian'},
    ])
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '199',
      first_name: 'Lisa',
      last_name: 'Simpson',
      date_of_birth: '2016-12-31',
      gender: 'female',
      ssn: 'ssn-1',
      races: races,
      addresses: [{}],
      phone_numbers: [{}],
    })
    let component
    beforeEach(() => {
      component = shallow(<ParticipantEditView participant={participant} onChange={onChange} />)
    })
    it('renders the races in edit view', () => {
      expect(component.find('RacesEditView').length).toEqual(1)
      expect(component.find('RacesEditView').props().id).toEqual('participant-199')
    })
    it('passes the paricipant race info', () => {
      expect(component.find('RacesEditView').props().races).toEqual(races)
    })
    it('fires the onChange call when a field changes', () => {
      component.find('RacesEditView').simulate('change', {target: {value: {race: 'Asian'}}})
      expect(onChange).toHaveBeenCalledWith(['races'], {target: {value: {race: 'Asian'}}})
    })
  })

  describe('approximate age when dob is set', () => {
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '199',
      date_of_birth: '2016-12-31',
    })
    let component
    beforeEach(() => {
      component = shallow(<ParticipantEditView participant={participant} onChange={onChange} />)
    })
    it('is disabled when DoB is populated', () => {
      expect(component.find('InputField[label="Approximate Age"]').props().disabled)
        .toEqual(true)
      expect(component.find('select[aria-label="Approximate Age Units"]').props().disabled)
        .toEqual(true)
    })
  })

  describe('onBlur of DOB', () => {
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '199',
      approximate_age: '10',
      approximate_age_units: 'Months',
    })
    let component
    beforeEach(() => {
      component = shallow(<ParticipantEditView participant={participant} onChange={onChange} onDobBlur={onDobBlur} />)
    })
    it('calls onDobBlur', () => {
      component.find('DateField[label="Date of birth"]').props().onBlur('2016-1-1')
      expect(onDobBlur).toHaveBeenCalledWith('2016-1-1')
    })
  })

  describe('approximate age validations', () => {
    const participant = Immutable.fromJS({
      ...requiredParticipantProps,
      id: '199',
    })
    let component
    beforeEach(() => {
      component = shallow(<ParticipantEditView participant={participant} onChange={onChange} />)
    })
    it('limits data entry to numeric digits', () => {
      expect(component.find('InputField[label="Approximate Age"]').props().maxLength).toEqual('3')
    })
    it('limits data entry to a maximum of three characters', () => {
      expect(component.find('InputField[label="Approximate Age"]').props().allowCharacters).toEqual(/[0-9]/)
    })
  })
})
