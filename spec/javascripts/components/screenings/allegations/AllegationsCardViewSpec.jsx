import AllegationsCardView from 'screenings/AllegationsCardView'
import Immutable from 'immutable'
import React from 'react'
import {shallow} from 'enzyme'
import * as AllegationsHelper from 'utils/allegationsHelper'

describe('AllegationsCardView', () => {
  let component
  let instance
  const allegations = Immutable.fromJS([
    {id: null, allegation_types: []},
    {id: '1', allegation_types: []},
    {id: null, allegation_types: []},
    {id: '2', allegation_types: []},
  ])

  const requiredProps = {
    allegations: Immutable.List(),
    required: false,
    mode: 'edit',
    editable: true,
  }

  beforeEach(() => {
    requiredProps.onSave = jasmine.createSpy('onSave')
    requiredProps.onChange = jasmine.createSpy('onChange')
    requiredProps.onCancel = jasmine.createSpy('onCancel')
  })

  describe('#onCancel', () => {
    beforeEach(() => {
      requiredProps.onCancel = jasmine.createSpy('onCancel')
      component = shallow(<AllegationsCardView {...requiredProps} mode={'edit'}/>)
      instance = component.instance()
      instance.onCancel()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('clears edits for the allegations card', () => {
      expect(requiredProps.onCancel).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onSave', () => {
    beforeEach(() => {
      requiredProps.onSave = jasmine.createSpy('onSave')
      component = shallow(<AllegationsCardView {...requiredProps}/>)
      instance = component.instance()
      instance.onSave()
    })

    it('toggles the mode to show', () => {
      expect(instance.state.mode).toEqual('show')
    })

    it('calls onSave from props with the appropriate values', () => {
      expect(requiredProps.onSave).toHaveBeenCalledWith(['allegations'])
    })
  })

  describe('#onChange', () => {
    it('calls onChange from props with the appropriate values', () => {
      const allegationTypes = Immutable.List(['General Neglect'])
      const onChange = jasmine.createSpy('onChange')
      requiredProps.onChange = onChange
      component = shallow(<AllegationsCardView {...requiredProps}/>)
      component.instance().onChange('123', '456', allegationTypes)

      const callParams = onChange.calls.argsFor(0)
      const fieldSeq = callParams[0]
      const actualAllegationTypes = callParams[1]
      expect(fieldSeq).toEqual(['allegations', '123', '456'])
      expect(actualAllegationTypes.toJS()).toEqual(allegationTypes.toJS())
      expect(Immutable.is(actualAllegationTypes, allegationTypes)).toEqual(true)
    })
  })

  describe('alertErrorMessage', () => {
    describe('when allegations are NOT required', () => {
      it('returns null when allegations are not required', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const props = {
          ...requiredProps,
          required: false,
        }
        const component = shallow(<AllegationsCardView {...props}/>)
        expect(component.instance().alertErrorMessage()).toEqual(null)
      })

      it('returns a message when at risk is required and not present', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        const props = {
          ...requiredProps,
          required: false,
        }
        const component = shallow(<AllegationsCardView {...props}/>)
        expect(component.instance().alertErrorMessage()).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })

    describe('when allegations are required', () => {
      it('returns null when allegation are required but valid allegations exist', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const props = {
          ...requiredProps,
          required: true,
          allegations: Immutable.fromJS([{
            id: 1,
            victim_id: '123abc',
            perpetrator_id: 'cba321',
            allegation_types: ['Physical abuse'],
          }]),
        }
        const component = shallow(<AllegationsCardView {...props}/>)
        expect(component.instance().alertErrorMessage()).toEqual(null)
      })

      it('returns a message when allegations are required and no allegations are valid', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(true)
        const props = {
          ...requiredProps,
          required: true,
          allegations: Immutable.fromJS([{
            id: 1,
            victim_id: '123abc',
            perpetrator_id: 'cba321',
            allegation_types: [],
          }]),
        }
        const component = shallow(<AllegationsCardView {...props}/>)
        expect(component.instance().alertErrorMessage()).toContain('must include at least one allegation.')
      })

      it('returns a message when at risk is only allegation', () => {
        spyOn(AllegationsHelper, 'siblingAtRiskHasRequiredComplementaryAllegations').and.returnValue(false)
        const props = {
          ...requiredProps,
          required: true,
          allegations: Immutable.fromJS([{
            id: 1,
            victim_id: '123abc',
            perpetrator_id: 'cba321',
            allegation_types: ['At risk, sibling abused'],
          }]),
        }
        const component = shallow(<AllegationsCardView {...props}/>)
        expect(component.instance().alertErrorMessage()).toEqual('Any allegations of Sibling at Risk must be accompanied by another allegation.')
      })
    })
  })

  describe('show mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'show'
    })

    it('renders the allegations show view', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('Connect(AllegationShow)').length).toEqual(1)
    })

    it('knows whether or not allegations are required', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('Connect(AllegationShow)').props().required).toEqual(false)
    })
  })

  describe('edit mode', () => {
    beforeEach(() => {
      requiredProps.mode = 'edit'
    })

    it('renders the allegations edit view', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsEditView').length).toEqual(1)
    })

    it("renders all allegations, with or without id's", () => {
      component = shallow(<AllegationsCardView {...requiredProps} allegations={allegations} />)
      const renderedAllegations = component.find('AllegationsEditView').props().allegations

      expect(renderedAllegations).toEqual(allegations)
    })

    it('passes onChange to the edit card', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsEditView').props().onChange).toEqual(component.instance().onChange)
    })

    it('knows whether or not allegations are required', () => {
      component = shallow(<AllegationsCardView {...requiredProps} />)
      expect(component.find('AllegationsEditView').props().required).toEqual(false)
    })
  })
})
