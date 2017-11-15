import * as IntakeConfig from 'common/config'
import PersonCard from 'views/people/PersonCard'
import React from 'react'
import {shallow} from 'enzyme'

describe('PersonCard', () => {
  function renderPersonCard({
    editable = false,
    informationFlag = undefined,
    mode = 'show',
    onCancel = () => null,
    onDelete = () => null,
    onEdit = () => null,
    onSave = () => null,
    personId = '123',
    personName = 'Bob Smith',
  }) {
    const props = {
      editable,
      informationFlag,
      mode,
      onCancel,
      onDelete,
      onEdit,
      onSave,
      personId,
      personName,
    }
    return shallow(<PersonCard {...props}/>)
  }

  describe('when release two is active', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(false)
    })
    it('displays a card header', () => {
      const component = renderPersonCard({
        editable: true,
        informationFlag: 'Sensitive Or Sealed',
        personName: 'John Q. Public',
      })
      const cardHead = component.find('PersonCardHeader')
      expect(cardHead.props().informationFlag).toEqual('Sensitive Or Sealed')
      expect(cardHead.props().showDelete).toEqual(true)
      expect(cardHead.props().showEdit).toEqual(false)
      expect(cardHead.props().title).toEqual('John Q. Public')
    })
  })
  describe('when release two is inactive', () => {
    beforeEach(() => {
      spyOn(IntakeConfig, 'isFeatureInactive').and.returnValue(true)
    })
    describe('mode is show', () => {
      it('displays a card header', () => {
        const component = renderPersonCard({
          editable: true,
          informationFlag: 'Sensitive Or Sealed',
          personName: 'John Q. Public',
        })
        const cardHead = component.find('PersonCardHeader')
        expect(cardHead.props().informationFlag).toEqual('Sensitive Or Sealed')
        expect(cardHead.props().showDelete).toEqual(true)
        expect(cardHead.props().showEdit).toEqual(true)
        expect(cardHead.props().title).toEqual('John Q. Public')
      })
      it('renders div with id', () => {
        const component = renderPersonCard({
          mode: 'show',
          personId: '42',
        })
        const div = component.find('div.card')
        expect(div.props().className).toContain('show')
        expect(div.props().id).toContain('participants-card-42')
      })
      it('renders show children', () => {
        const component = shallow(
          <PersonCard
            edit={<p>Editing</p>}
            editable={true}
            mode='show'
            onCancel={() => null}
            onDelete={() => null}
            onEdit={() => null}
            onSave={() => null}
            personId='1234'
            personName='Bob Smith'
            show={<p>Showing</p>}
          />
        )
        expect(component.find('.card-body').children('p').at(0).text()).toEqual('Showing')
      })
      it('does not render save and cancel buttons', () => {
        const component = renderPersonCard({mode: 'show'})
        expect(component.find('button.btn-primary').exists()).toEqual(false)
        expect(component.find('button.btn-default').exists()).toEqual(false)
      })
    })
    describe('mode is edit', () => {
      it('displays a card header', () => {
        const onDelete = jasmine.createSpy('onDelete')
        const onEdit = jasmine.createSpy('onEdit')
        const component = renderPersonCard({
          editable: true,
          informationFlag: 'Sensitive Or Sealed',
          personName: 'John Q. Public',
          mode: 'edit',
          onDelete,
          onEdit,
        })
        const cardHead = component.find('PersonCardHeader')
        expect(cardHead.props().informationFlag).toEqual('Sensitive Or Sealed')
        expect(cardHead.props().showDelete).toEqual(true)
        expect(cardHead.props().showEdit).toEqual(false)
        expect(cardHead.props().onDelete).toEqual(onDelete)
        expect(cardHead.props().onEdit).toEqual(onEdit)
        expect(cardHead.props().title).toEqual('John Q. Public')
      })
      it('renders div with id', () => {
        const component = renderPersonCard({
          mode: 'edit',
          personId: '42',
        })
        const div = component.find('div.card')
        expect(div.props().className).toContain('edit')
        expect(div.props().id).toContain('participants-card-42')
      })
      it('renders edit children', () => {
        const component = shallow(
          <PersonCard
            edit={<p>Editing</p>}
            editable={true}
            mode='edit'
            onCancel={() => null}
            onDelete={() => null}
            onEdit={() => null}
            onSave={() => null}
            personId='1234'
            personName='Bob Smith'
            show={<p>Showing</p>}
          />
        )
        expect(component.find('.card-body').children('p').at(0).text()).toEqual('Editing')
      })
      it('does render save and cancel buttons', () => {
        const onSave = jasmine.createSpy('onSave')
        const onCancel = jasmine.createSpy('onCancel')
        const component = renderPersonCard({
          onCancel,
          onSave,
          mode: 'edit',
        })
        const btnPrimary = component.find('button.btn-primary')
        const btnDefault = component.find('button.btn-default')
        expect(btnPrimary.exists()).toEqual(true)
        expect(btnPrimary.props().onClick).toEqual(onSave)
        expect(btnDefault.exists()).toEqual(true)
        expect(btnDefault.props().onClick).toEqual(onCancel)
      })
    })
  })
})
