import * as Immutable from 'immutable'
import RelationshipsCard from 'screenings/RelationshipsCard'
import React from 'react'
import {shallow, mount} from 'enzyme'

describe('RelationshipsCard', () => {
  const requiredProps = {
    actions: {},
    participants: Immutable.List(),
    relationships: Immutable.List(),
    screeningId: '33',
  }
  let component
  beforeEach(() => {
    component = shallow(<RelationshipsCard {...requiredProps}/>)
  })

  describe('#componentDidMount', () => {
    let fetchRelationships
    beforeEach(() => {
      fetchRelationships = jasmine.createSpy('fetchRelationships')
    })

    describe('when participants are not empty', () => {
      it('fetch relationships', () => {
        const props = {
          ...requiredProps,
          actions: {fetchRelationships},
          participants: Immutable.fromJS([
            {id: 1},
            {id: 2},
          ]),
        }
        component = mount(<RelationshipsCard {...props}/>)
        expect(fetchRelationships).toHaveBeenCalledWith(props.screeningId)
      })
    })

    describe('when participants are empty', () => {
      it('does not fetch relationships', () => {
        const props = {
          ...requiredProps,
          actions: {fetchRelationships},
          participants: Immutable.List(),
        }
        component = mount(<RelationshipsCard {...props}/>)
        expect(fetchRelationships).not.toHaveBeenCalled()
      })
    })
  })

  describe('#componentWillReceiveProps', () => {
    let fetchRelationships
    beforeEach(() => {
      fetchRelationships = jasmine.createSpy('fetchRelationships')
      const updatedProps = {
        ...requiredProps,
        actions: {fetchRelationships},
      }
      component = shallow(<RelationshipsCard {...updatedProps}/>)
    })

    describe('when participants change', () => {
      it('fetch relationships', () => {
        const newProps = {
          ...requiredProps,
          participants: Immutable.fromJS([
            {id: 1},
            {id: 2},
          ]),
        }
        component.setProps(newProps)
        expect(fetchRelationships).toHaveBeenCalledWith(newProps.screeningId)
      })
    })

    describe('when participants are the same', () => {
      it('does not fetch relationships', () => {
        const newProps = {participants: Immutable.List()}
        component.setProps(newProps)
        expect(fetchRelationships).not.toHaveBeenCalled()
      })
    })
  })

  describe('when there are no participants', () => {
    it('shows a message', () => {
      expect(component.find('div#relationships-card .card-body').text()).toEqual('Search for people and add them to see their relationships.')
    })

    it('has a title', () => {
      expect(component.find('div#relationships-card .card-header').text()).toEqual('Relationships')
    })
  })

  describe('with one participant', () => {
    describe('when participant has no known relationships', () => {
      it('shows the participant name and no relationships message', () => {
        const props = {
          ...requiredProps,
          relationships: Immutable.fromJS([
            {id: '1', first_name: 'Aubrey', last_name: 'Campbell', relationships: []},
          ]),
        }
        component = shallow(<RelationshipsCard {...props}/>)
        expect(component.find('div#relationships-card .card-body .row').text()).toEqual('Aubrey Campbell has no known relationships')
      })
    })
    describe('when participant has a relationship', () => {
      it('shows the participant name and the relationship', () => {
        const props = {
          ...requiredProps,
          relationships: Immutable.fromJS([
            {
              id: '1',
              first_name: 'Aubrey',
              last_name: 'Campbell',
              relationships: [
                {
                  related_person_first_name: 'Jake',
                  related_person_last_name: 'Campbell',
                  relationship: 'Sister/Brother (Half)',
                  related_person_relationship: 'Brother',
                  indexed_person_relationship: 'Sister',
                  relationship_context: 'Half',
                  related_person_id: '7',
                },
              ],
            },
          ]),
        }
        component = shallow(<RelationshipsCard {...props} />)
        const relationship = component.find('div#relationships-card .card-body .row').text()
        const relationships = component.find('div#relationships-card .card-body .row .relationships').text()
        expect(relationship).toContain('Aubrey Campbell is the..')
        expect(relationships).toContain('Sister of Jake Campbell')
      })

      describe('when participant does not have a full name', () => {
        it('shows unknown Person if neither first nor last name', () => {
          const props = {
            ...requiredProps,
            relationships: Immutable.fromJS([
              {
                id: '1',
                first_name: '',
                last_name: '',
                relationships: [
                  {
                    related_person_first_name: '',
                    related_person_last_name: '',
                    relationship: 'Sister/Brother (Half)',
                    related_person_relationship: 'Brother',
                    indexed_person_relationship: 'Sister',
                    relationship_context: 'Half',
                    related_person_id: '7',
                  },
                ],
              },
            ]),
          }
          component = shallow(<RelationshipsCard {...props} />)
          const relationship = component.find('div#relationships-card .card-body .row').text()
          const relationships = component.find('div#relationships-card .card-body .row .relationships').text()
          expect(relationship).toContain('Unknown Person is the..')
          expect(relationships).toContain('Sister of Unknown Person')
        })
      })
    })

    describe('when participant has many relationships', () => {
      beforeEach(() => {
        const props = {
          ...requiredProps,
          relationships: Immutable.fromJS([
            {id: '1', first_name: 'Aubrey', last_name: 'Campbell', relationships: [
              {
                related_person_first_name: 'Jake',
                related_person_last_name: 'Campbell',
                relationship: 'Sister/Brother (Half)',
                related_person_relationship: 'Brother',
                indexed_person_relationship: 'Sister',
                relationship_context: 'Half',
                related_person_legacy_id: '7',
              },
              {
                related_person_first_name: 'Joe',
                related_person_last_name: 'Campbell',
                relationship: 'Niece/Uncle',
                related_person_relationship: 'Uncle',
                indexed_person_relationship: 'Niece',
                related_person_legacy_id: '20',
              },
            ]},
          ]),
        }
        component = shallow(<RelationshipsCard {...props} />)
      })
      it('shows the participant name the relationship', () => {
        const relationship = component.find('div#relationships-card .card-body .row').text()
        const jakeRelationship = component.find('li#participant-1-relationship-7').text()
        const joeRelationship = component.find('li#participant-1-relationship-20').text()
        expect(relationship).toContain('Aubrey Campbell is the..')
        expect(jakeRelationship).toContain('Sister of Jake Campbell')
        expect(joeRelationship).toContain('Niece of Joe Campbell')
      })
    })
  })

  describe('with more than one participant', () => {
    describe('when participants have a variety of known relationships', () => {
      it('shows each participant with related relationships', () => {
        const props = {
          ...requiredProps,
          relationships: Immutable.fromJS([
            {
              id: '1',
              first_name: 'Aubrey',
              last_name: 'Campbell',
              relationships: [],
            },
            {
              id: '6',
              first_name: 'Jake',
              last_name: 'Jones',
              relationships: [
                {
                  related_person_first_name: 'Joe',
                  related_person_last_name: 'Simpson',
                  relationship: 'Brother/Brother',
                  related_person_relationship: 'Brother',
                  indexed_person_relationship: 'Brother',
                  related_person_legacy_id: '7',
                },
              ],
            },
            {
              id: '20',
              first_name: 'Sam',
              last_name: 'Campbell',
              relationships: [
                {
                  related_person_first_name: 'Joe',
                  related_person_last_name: 'Simpson',
                  relationship: 'Nephew/Uncle',
                  related_person_relationship: 'Uncle',
                  indexed_person_relationship: 'Nephew',
                  related_person_legacy_id: '7',
                },
              ],
            },
          ]),
        }
        const component = shallow(<RelationshipsCard {...props} />)
        const relationRows = component.find('.row')
        expect(relationRows.at(0).text()).toEqual('Aubrey Campbell has no known relationships')

        expect(relationRows.at(1).text()).toContain('Jake Jones is the...')
        expect(relationRows.at(1).find('li#participant-6-relationship-7').text()).toContain('Brother of Joe Simpson')

        expect(relationRows.at(2).text()).toContain('Sam Campbell is the...')
        expect(relationRows.at(2).find('li#participant-20-relationship-7').text()).toContain('Nephew of Joe Simpson')
      })
    })
  })
})
