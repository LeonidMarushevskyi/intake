import PersonSuggestion from 'common/PersonSuggestion'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonSuggestion', () => {
  it('renders first, last name, middle name and suffix', () => {
    const props = {firstName: 'Bart', lastName: 'Simpson', middleName: 'Jacqueline', nameSuffix: 'md'}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<strong class="highlighted">Bart Jacqueline Simpson MD</strong>')
  })

  it('renders legacy source table and id', () => {
    const props = {legacyDescriptor: {legacy_ui_id: '123-456-789', legacy_table_description: 'Client'}}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<span>Client ID 123-456-789 in CWS-CMS</span>')
  })

  it('renders just the legacy table if no id exists', () => {
    const props = {legacyDescriptor: {legacy_table_description: 'Client'}}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<span>Client in CWS-CMS</span>')
  })

  it('renders html sanitized first, last name, middle name and suffix', () => {
    const props = {firstName: '<h3>Bart</h3>', lastName: '<strong>Simpson</strong>', middleName: 'Jacqueline', nameSuffix: 'md'}
    const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
    expect(component.html()).toContain('<strong class="highlighted">Bart Jacqueline Simpson MD</strong>')
  })

  describe('sensitive', () => {
    it('renders when sensitive', () => {
      const props = {isSensitive: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Sensitive')
    })

    it('does not render when not sensitive', () => {
      const props = {isSensitive: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Sensitive')
    })
  })

  describe('sealed', () => {
    it('renders when is_sealed', () => {
      const props = {isSealed: true}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain('Sealed')
    })

    it('does not render when not is_sealed', () => {
      const props = {isSealed: false}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('Sealed')
    })
  })

  describe('ssn', () => {
    it('renders when present', () => {
      const props = {ssn: '123-456-7890'}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span class="highlighted">123-456-7890</span></div>'
      )
    })

    it('renders sanitized ssn', () => {
      const props = {ssn: '<em><h3>123-456-7890</h3></em>'}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span class="highlighted"><em>123-456-7890</em></span></div>'
      )
    })

    it('does not render when not present', () => {
      const props = {ssn: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.html()).not.toContain('SSN')
    })
  })

  describe('address', () => {
    it('does not render when not present', () => {
      const props = {address: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('AddressInfo').length).toEqual(0)
    })
  })

  describe('phonenumber', () => {
    it('does not render when not present', () => {
      const props = {phoneNumber: null}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('PhoneNumberInfo').length).toEqual(0)
    })
  })

  describe('render components', () => {
    let component
    beforeEach(() => {
      component = shallow(<PersonSuggestion />, {disableLifecycleMethods: true})
    })

    it('renders the GenderRaceAndEthnicity', () => {
      expect(component.find('GenderRaceAndEthnicity').length).toEqual(1)
    })

    it('renders the AgeInfo', () => {
      expect(component.find('AgeInfo').length).toEqual(1)
    })

    it('renders the AddressInfo', () => {
      const props = {address: {}}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('AddressInfo').length).toEqual(1)
    })

    it('renders the PhoneNumberInfo', () => {
      const props = {phoneNumber: {}}
      const component = shallow(<PersonSuggestion {...props} />, {disableLifecycleMethods: true})
      expect(component.find('PhoneNumberInfo').length).toEqual(1)
    })
  })
})
