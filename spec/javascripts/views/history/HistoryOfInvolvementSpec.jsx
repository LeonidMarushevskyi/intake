import HistoryOfInvolvement from 'views/history/HistoryOfInvolvement'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryOfInvolvement', () => {
  it('renders an empty history card when history is not present', () => {
    const component = shallow(
      <HistoryOfInvolvement
        historyIsEmpty={true}
        empty={<p>Hello!</p>}
        notEmpty={<p>Goodbye!</p>}
      />
    )
    expect(component.html()).toContain('<p>Hello!</p>')
    expect(component.html()).not.toContain('Goodbye!')
  })

  it('renders a history table when history is present', () => {
    const component = shallow(
      <HistoryOfInvolvement
        historyIsEmpty={false}
        empty={<p>Hello!</p>}
        notEmpty={<p>Goodbye!</p>}
      />
    )
    expect(component.html()).toContain('<p>Goodbye!</p>')
    expect(component.html()).not.toContain('Hello!')
  })
})
