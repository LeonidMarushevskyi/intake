import React from 'react'
import {shallow} from 'enzyme'
import PersonInformationShow from 'views/people/PersonInformationShow'

describe('PersonInformationShow', () => {
  const name = {value: '', errors: [], required: false}
  it('renders the default avatar', () => {
    const view = shallow(<PersonInformationShow name={name} roles={[]}/>)
    expect(view.find('img').props().src).toContain('default-profile.svg')
  })
  it('renders the legacy source of the person', () => {
    const name = {value: '', errors: [], required: false}
    const view = shallow(<PersonInformationShow roles={[]} name={name} legacySource={'4, 8, 15, 16, 23'}/>)
    expect(view.text()).toContain('4, 8, 15, 16, 23')
  })
  it('renders the display name of the person', () => {
    const name = {value: 'tester', errors: [], required: false}
    const view = shallow(<PersonInformationShow roles={[]} name={name}/>)
    expect(view.find('ShowField[label="Name"]').html()).toContain('tester')
  })
  it('renders the gender of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} name={name} gender={'decline to answer'}/>)
    expect(view.find('ShowField[label="Gender"]').html()).toContain('decline to answer')
  })
  it('renders the roles of the person', () => {
    const view = shallow(<PersonInformationShow roles={['judge', 'jury', 'executioner']} name={name}/>)
    expect(view.find('ShowField[label="Role(s)"]').html()).toContain('judge', 'jury', 'executioner')
  })
  it('renders the language(s) of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} languages={'Klingon'} name={name}/>)
    expect(view.find('ShowField[label="Language(s) (Primary First)"]').html()).toContain('Klingon')
  })
  it('renders the date of birth of the person when provided', () => {
    const view = shallow(<PersonInformationShow roles={[]} dateOfBirth={'Safar 17, 1440'} name={name}/>)
    expect(view.find('ShowField[label="Date of birth"]').html()).toContain('Safar 17, 1440')
  })
  it('renders the approximate age of the person when date of birth is absent', () => {
    const view = shallow(<PersonInformationShow roles={[]} approximateAge={'-1'} name={name}/>)
    expect(view.find('ShowField[label="Date of birth"]').exists()).toBe(false)
    expect(view.find('ShowField[label="Approximate Age"]').html()).toContain('-1')
  })
  it('renders the Social security number of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} ssn={'???-??-?'} name={name}/>)
    expect(view.find('ShowField[label="Social security number"]').html()).toContain('???-??-?')
  })
  it('renders the Race of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} races={'Martian - Green Martian'} name={name}/>)
    expect(view.find('ShowField[label="Race"]').html()).toContain('Martian - Green Martian')
  })
  it('renders the Hispanic/Latino Origin of the person', () => {
    const view = shallow(<PersonInformationShow roles={[]} ethnicity={'Maybe'} name={name}/>)
    expect(view.find('ShowField[label="Hispanic/Latino Origin"]').html()).toContain('Maybe')
  })
  it('displays an errorMessage alert if one is passed', () => {
    const alert = 'Alleged victims must be identified with a name, even Doe or Unknown, and must be under the age of 18'
    const view = shallow(<PersonInformationShow alertErrorMessage={alert} roles={[]} name={name}/>)
    expect(view.find('AlertErrorMessage').exists()).toEqual(true)
    expect(view.find('AlertErrorMessage').props().message).toEqual(alert)
  })
  it('does not display an errorMessage alert if one is not passed', () => {
    const view = shallow(<PersonInformationShow roles={[]} name={name}/>)
    expect(view.find('AlertErrorMessage').exists()).toEqual(false)
  })
  it('renders the name required flag', () => {
    const name = {value: 'tester', errors: [], required: true}
    const view = shallow(<PersonInformationShow roles={['Victim']} name={name}/>)
    expect(view.find('ShowField[label="Name"]').props().required).toEqual(true)
  })
  it('renders the first name error', () => {
    const name = {value: 'tester', errors: ['Please enter a first name.'], required: true}
    const view = shallow(<PersonInformationShow roles={['Victim']} name={name}/>)
    expect(view.find('ShowField[label="Name"]').props().errors).toEqual(['Please enter a first name.'])
  })
})
