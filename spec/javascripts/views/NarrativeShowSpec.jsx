import NarrativeShow from 'views/NarrativeShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeShow', () => {
  function renderNarrative(props) {
    return shallow(<NarrativeShow {...props} />, {disableLifecycleMethods: true})
  }

  it('displays the narrative', () => {
    const component = renderNarrative({narrative: 'This is my favorite screening'})
    expect(component.html()).toContain('This is my favorite screening')
  })

  it('displays errors', () => {
    const component = renderNarrative({errors: ['This screening has no narrative']})
    expect(component.html()).toContain('This screening has no narrative')
  })
})
