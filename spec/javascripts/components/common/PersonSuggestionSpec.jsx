import PersonSuggestion from 'components/common/PersonSuggestion'
import React from 'react'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('PersonSuggestion', () => {
  it('renders first and last name', () => {
    const props = {firstName: 'Bart', lastName: 'Simpson'}
    const component = shallow(<PersonSuggestion {...props} />)
    expect(component.html()).toContain('<strong>Bart Simpson</strong>')
  })

  it('renders gender', () => {
    const props = {gender: 'female'}
    const component = shallow(<PersonSuggestion {...props} />)
    expect(component.html()).toContain('<div>Female</div>')
  })

  describe('age', () => {
    it('renders when DOB is present', () => {
      const dob = moment().subtract(15, 'years').format('YYYY-MM-DD')
      const props = {dateOfBirth: dob}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).toContain('15 yrs old')
    })

    it('does not render when DOB is not present', () => {
      const props = {dateOfBirth: null}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).not.toContain('yrs old')
    })
  })

  describe('ssn', () => {
    it('renders when present', () => {
      const props = {ssn: '123-456-7890'}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).toContain(
        '<div><strong class="c-gray half-pad-right">SSN</strong><span>123-456-7890</span></div>'
      )
    })

    it('does not render when not present', () => {
      const props = {ssn: null}
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).not.toContain('SSN')
    })
  })

  describe('address', () => {
    it('renders when present', () => {
      const props = {
        address: {
          id: 1,
          streetAddress: '234 Fake Street',
          city: 'Flushing',
          state: 'NM',
          zip: '11344',
          type: 'School',
        },
      }
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><strong class="c-gray half-pad-right">School</strong><span>234 Fake Street, Flushing, NM 11344</span></div>')
    })

    it('gets rendered correctly when partial address is given', () => {
      const props = {
        address: {
          id: 1,
          streetAddress: null,
          city: null,
          state: 'NM',
          zip: '11344',
          type: null,
        },
      }
      const component = shallow(<PersonSuggestion {...props} />)
      expect(component.find('AddressInfo').length).toEqual(1)
      expect(component.html()).toContain('<div><i class="fa fa-map-marker c-gray half-pad-right"></i><span>NM 11344</span></div>')
    })

    it('does not render when not present', () => {
      const props = {address: null}
      const component = shallow(<PersonSuggestion{...props} />)
      expect(component.find('AddressInfo').length).toEqual(0)
    })
  })
})
