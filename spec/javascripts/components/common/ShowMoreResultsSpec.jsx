import ShowMoreResults from 'common/ShowMoreResults'
import React from 'react'
import {shallow} from 'enzyme'

describe('ShowMoreResults', () => {
  let button
  let onSelect

  beforeEach(() => {
    onSelect = jasmine.createSpy('onSelect')
    button = shallow(
      <ShowMoreResults onSelect={onSelect} />
    ).find('button')
  })

  it("renders the 'show more results' button", () => {
    expect(button.text()).toContain('Show more results')
  })

  it('calls onSelect when the button is clicked', () => {
    button.simulate('click')
    expect(onSelect).toHaveBeenCalled()
  })
})
