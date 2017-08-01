import React from 'react'
import {shallow} from 'enzyme'
import PhoneNumberInfo from 'common/PhoneNumberInfo'

describe('phone numbers', () => {
  it('renders when present', () => {
    const props = {
      number: '994-907-6774',
      type: 'Home',
    }
    const component = shallow(<PhoneNumberInfo {...props} />)
    expect(component.html()).toContain('<div><i class="fa fa-phone c-gray half-pad-right"></i><strong class="c-gray half-pad-right">Home</strong><span>994-907-6774</span></div>')
  })

  it('renders when phone type is not given', () => {
    const props = {
      number: '994-907-6774',
      type: null,
    }
    const component = shallow(<PhoneNumberInfo {...props} />)
    expect(component.html()).toContain('<div><i class="fa fa-phone c-gray half-pad-right"></i><span>994-907-6774</span></div>')
  })
})
