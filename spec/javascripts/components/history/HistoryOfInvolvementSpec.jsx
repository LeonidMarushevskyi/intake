import HistoryOfInvolvement from 'history/HistoryOfInvolvement'
import React from 'react'
import {shallow} from 'enzyme'

describe('HistoryOfInvolvement', () => {
  function renderHistoryOfInvolvement({historyIsEmpty = true}) {
    return shallow(<HistoryOfInvolvement historyIsEmpty={historyIsEmpty} />)
  }

  it('displays a card header', () => {
    const component = renderHistoryOfInvolvement({})
    const cardHead = component.find('.card-header')
    expect(cardHead.html()).toContain('History')
  })

  it('renders an empty history card when history is not present', () => {
    const component = shallow(
      <HistoryOfInvolvement
        historyIsEmpty={true}
        empty={<p>Hello!</p>}
        notEmpty={<p>Goodbye!</p>}
      />
    )
    expect(component.children('p').at(0).text()).toEqual('Hello!')
    expect(component.text()).not.toContain('Goodbye!')
  })

  it('renders a history table when history is present', () => {
    const component = shallow(
      <HistoryOfInvolvement
        historyIsEmpty={false}
        empty={<p>Hello!</p>}
        notEmpty={<p>Goodbye!</p>}
      />
    )
    expect(component.children('p').at(0).text()).toEqual('Goodbye!')
    expect(component.text()).not.toContain('Hello!')
  })
})
