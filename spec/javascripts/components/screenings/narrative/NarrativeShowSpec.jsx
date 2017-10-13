import NarrativeShow from 'screenings/narrative/NarrativeShow'
import React from 'react'
import {shallow} from 'enzyme'

describe('NarrativeShow', () => {
  function renderNarrative(props) {
    return shallow(<NarrativeShow {...props} />)
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
