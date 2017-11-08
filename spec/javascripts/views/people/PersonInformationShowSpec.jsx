import React from 'react'
import {shallow} from 'enzyme'
import PersonInformationShow from 'views/people/PersonInformationShow'

describe('PersonInformationShow', () => {
  let component
  const props = {
    display_name: 'tester',
    legacy_source: '4, 8, 15, 16, 23, 42',
    gender: 'decline to answer',
    roles: ['judge', 'jury', 'executioner'],
    languages: 'bilingual in Na’vi and Klingon',
    date_of_birth: 'Safar 17, 1440',
    approximate_age: '-1',
    ssn: '???-??-?',
    races: 'Martian - Green Martian',
    ethnicity: 'Maybe',
  }
  beforeEach(() => {
    component = shallow(<PersonInformationShow {...props}/>)
  })
  it('renders the default avatar', () => {
    expect(component.find('img').props().src).toContain('default-profile.svg')
  })
  it('renders the legacy source of the person', () => {
    expect(component.text()).toContain('4, 8, 15, 16, 23, 42')
  })
  it('renders the display name of the person', () => {
    expect(component.find('ShowField[label="Name"]').html()).toContain('tester')
  })
  it('renders the gender of the person', () => {
    expect(component.find('ShowField[label="Gender"]').html()).toContain('decline to answer')
  })
  it('renders the roles of the person', () => {
    expect(component.find('ShowField[label="Role(s)"]').html())
      .toContain('judge', 'jury', 'executioner')
  })
  it('renders the language(s) of the person', () => {
    expect(component.find('ShowField[label="Language(s) (Primary First)"]').html())
      .toContain('bilingual in Na’vi and Klingon')
  })
  it('renders the date of birth of the person when provided', () => {
    expect(component.find('ShowField[label="Date of birth"]').html()).toContain('Safar 17, 1440')
  })
  it('does not render the approximate age of the person when provided', () => {
    expect(component.find('ShowField[label="Approximate Age"]').exists()).toBe(false)
  })
  it('renders the approximate age of the person when date of birth is absent', () => {
    props.date_of_birth = undefined
    component = shallow(<PersonInformationShow {...props}/>)
    expect(component.find('ShowField[label="Date of birth"]').exists()).toBe(false)
    expect(component.find('ShowField[label="Approximate Age"]').html()).toContain('-1')
  })
  it('renders the Social security number of the person', () => {
    expect(component.find('ShowField[label="Social security number"]').html()).toContain('???-??-?')
  })
  it('renders the Race of the person', () => {
    expect(component.find('ShowField[label="Race"]').html()).toContain('Martian - Green Martian')
  })
  it('renders the Hispanic/Latino Origin of the person', () => {
    expect(component.find('ShowField[label="Hispanic/Latino Origin"]').html()).toContain('Maybe')
  })
})
