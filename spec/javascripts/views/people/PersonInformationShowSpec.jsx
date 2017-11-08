import React from 'react'
import {shallow} from 'enzyme'
import PersonInformationShow from 'views/people/PersonInformationShow'

describe('PersonInformationShow', () => {
  it('renders the default avatar', () => {
    const view = shallow(<PersonInformationShow roles={[]}/>)
    expect(view.find('img').props().src).toContain('default-profile.svg')
  })
  it('renders the legacy source of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} legacySource={'4, 8, 15, 16, 23'}/>)
    expect(view.text()).toContain('4, 8, 15, 16, 23')
  })
  it('renders the display name of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} name={'tester'}/>)
    expect(view.find('ShowField[label="Name"]').html()).toContain('tester')
  })
  it('renders the gender of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} gender={'decline to answer'}/>)
    expect(view.find('ShowField[label="Gender"]').html()).toContain('decline to answer')
  })
  it('renders the roles of the person', () => {
    const view = shallow(<PersonInformationShow roles={['judge', 'jury', 'executioner']}/>)
    expect(view.find('ShowField[label="Role(s)"]').html()).toContain('judge', 'jury', 'executioner')
  })
  it('renders the language(s) of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} languages={'Klingon'}/>)
    expect(view.find('ShowField[label="Language(s) (Primary First)"]').html()).toContain('Klingon')
  })
  it('renders the date of birth of the person when provided', () => {
    const view = shallow(<PersonInformationShow roles={[]} dateOfBirth={'Safar 17, 1440'}/>)
    expect(view.find('ShowField[label="Date of birth"]').html()).toContain('Safar 17, 1440')
  })
  it('does not render the approximate age of the person when DOB provided', () => {
    const view = shallow(<PersonInformationShow roles={[]} dateOfBirth={'1'} approximateAge={'1'}/>)
    expect(view.find('ShowField[label="Approximate Age"]').exists()).toBe(false)
  })
  it('renders the approximate age of the person when date of birth is absent', () => {
    const view = shallow(<PersonInformationShow roles={[]} approximateAge={'-1'}/>)
    expect(view.find('ShowField[label="Date of birth"]').exists()).toBe(false)
    expect(view.find('ShowField[label="Approximate Age"]').html()).toContain('-1')
  })
  it('renders the Social security number of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} ssn={'???-??-?'}/>)
    expect(view.find('ShowField[label="Social security number"]').html()).toContain('???-??-?')
  })
  it('renders the Race of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} races={'Martian - Green Martian'}/>)
    expect(view.find('ShowField[label="Race"]').html()).toContain('Martian - Green Martian')
  })
  it('renders the Hispanic/Latino Origin of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} ethnicity={'Maybe'}/>)
    expect(view.find('ShowField[label="Hispanic/Latino Origin"]').html()).toContain('Maybe')
  })
})
