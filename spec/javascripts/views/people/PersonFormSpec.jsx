import PersonForm from 'views/people/PersonForm'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonForm', () => {
  function renderPersonForm({
    personId = '123',
  }) {
    const props = {
      personId,
    }
    return shallow(<PersonForm {...props}/>)
  }

  it('renders the card body', () => {
    expect(renderPersonForm({}).exists()).toEqual(true)
  })
})
