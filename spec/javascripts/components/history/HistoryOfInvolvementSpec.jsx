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
    const component = renderHistoryOfInvolvement({historyIsEmpty: true})
    expect(component.find('EmptyHistory').exists()).toEqual(true)
    expect(component.find('HistoryTable').exists()).toEqual(false)
  })

  it('renders a history table when history is present', () => {
    const component = renderHistoryOfInvolvement({historyIsEmpty: false})
    expect(component.find('HistoryTable').exists()).toEqual(true)
    expect(component.find('EmptyHistory').exists()).toEqual(false)
  })
})
