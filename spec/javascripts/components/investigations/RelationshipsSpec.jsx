import React from 'react'
import {shallow} from 'enzyme'
import {EmptyRelationships, Relationships} from 'investigations/Relationships'

describe('Relationships', () => {
  const renderRelationships = ({relationships = [], ...args}) => {
    const props = {relationships, ...args}
    return shallow(<Relationships {...props} />)
  }
  it('renders people', () => {
    const people = ['Sally Jones', 'Nate Starbringer', 'Jim Johnson']
    const component = renderRelationships({people})
    expect(component.find('.person').at(0).text()).toEqual('Sally Jones')
    expect(component.find('.person').at(1).text()).toEqual('Nate Starbringer')
    expect(component.find('.person').at(2).text()).toEqual('Jim Johnson')
  })

  it('renders relationships for each person', () => {
    const people = ['Sally Jones', 'Nate Starbringer', 'Jim Johnson']
    const relationships = [
      {person: 'Sally Jones', relatee: 'Jim Johnson', relationship: 'mother'},
      {person: 'Nate Starbringer', relatee: 'Jim Johnson', relationship: 'father'},
      {person: 'Jim Johnson', relatee: 'Nate Starbringer', relationship: 'son'},
      {person: 'Jim Johnson', relatee: 'Sally Jones', relationship: 'son'},
    ]
    const component = renderRelationships({people, relationships})
    expect(component.find('.relationships').at(0).find('li').at(0).text()).toEqual('mother of Jim Johnson')
    expect(component.find('.relationships').at(1).find('li').at(0).text()).toEqual('father of Jim Johnson')
    expect(component.find('.relationships').at(2).find('li').at(1).text()).toEqual('son of Sally Jones')
    expect(component.find('.relationships').at(2).find('li').at(0).text()).toEqual('son of Nate Starbringer')
  })
})

describe('EmptyRelationships', () => {
  it('renders a reminder to add people when there are no relationships', () => {
    const component = shallow(<EmptyRelationships />)
    expect(component.find('.empty-relationships').text()).toEqual('Search for people and add them to see their relationships.')
  })
})
