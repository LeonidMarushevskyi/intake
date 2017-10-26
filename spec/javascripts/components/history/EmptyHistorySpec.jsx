import EmptyHistory from 'history/EmptyHistory'
import React from 'react'
import {shallow} from 'enzyme'

describe('EmptyHistory', () => {
  function renderEmptyHistory() {
    return shallow(<EmptyHistory />)
  }

  it('the user sees a message indicating empty state', () => {
    const component = renderEmptyHistory()
    expect(component.text())
      .toEqual('Search for people and add them to see their child welfare history.')
  })
})

