import React from 'react'
import {shallow} from 'enzyme'
import LanguageInfo from 'common/LanguageInfo'

describe('languages', () => {
  it('renders when present', () => {
    const props = {languages: ['French', 'Italian']}
    const component = shallow(<LanguageInfo {...props} />)
    expect(component.html()).toContain(
      '<div><strong class="c-gray half-pad-right">Language</strong><span>French (Primary), Italian</span></div>'
    )
  })

  it('does not render when not present', () => {
    const props = {languages: []}
    const component = shallow(<LanguageInfo {...props} />)
    expect(component.html()).not.toContain('Language')
  })
})
