import AgeInfo from 'common/AgeInfo'
import React from 'react'
import moment from 'moment'
import {shallow} from 'enzyme'

describe('age', () => {
  it('renders when DOB is present', () => {
    const dob = moment().subtract(15, 'years').format('YYYY-MM-DD')
    const props = {dateOfBirth: dob}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).toContain('15 yrs old')
  })

  it('does not render when DOB is not present', () => {
    const props = {dateOfBirth: null}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).not.toContain('yrs old')
  })

  it('renders highlighting for matching year', () => {
    const props = {dateOfBirth: '<em>2011</em>-11-11'}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).toContain('<span>11/11/<em>2011</em></span>')
  })

  it('renders highlighting for full match', () => {
    const props = {dateOfBirth: '<em>2007-01-11</em>'}
    const component = shallow(<AgeInfo {...props} />)
    expect(component.html()).toContain('<em>1/11/2007</em>')
  })
})
