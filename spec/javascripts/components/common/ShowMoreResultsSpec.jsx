import ShowMoreResults from 'common/ShowMoreResults'
import React from 'react'
import {shallow} from 'enzyme'

describe('ShowMoreResults', () => {
  let button
  let onClick

  beforeEach(() => {
    onClick = jasmine.createSpy('onClick')
    button = shallow(
      <ShowMoreResults onClick={onClick} />
    ).find('button')
  })

  it("renders the 'show more results' button", () => {
    expect(button.text()).toContain('Show more results')
  })

  it('calls onClick when the button is clicked', () => {
    button.simulate('click')
    expect(onClick).toHaveBeenCalled()
  })
})
