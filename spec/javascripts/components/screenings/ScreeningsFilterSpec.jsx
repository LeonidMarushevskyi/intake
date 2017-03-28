import CheckboxListFilter from 'components/common/CheckboxListFilter'
import React from 'react'
import ScreeningsFilter from 'components/screenings/ScreeningsFilter'
import SCREENING_DECISION from 'ScreeningDecision'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme'

describe('ScreeningsFilter', () => {
  describe('render', () => {
    it('contains an checkbox list filter component for screening decisions', () => {
      const component = mount(<ScreeningsFilter/>)
      expect(component.find(CheckboxListFilter).length).toEqual(1)
      expect(component.find(CheckboxListFilter).nodes[0].props.name).toEqual('screening-decision')
      expect(component.find(CheckboxListFilter).nodes[0].props.collection).toEqual(SCREENING_DECISION)
      expect(component.find(CheckboxListFilter).nodes[0].props.legend).toEqual('Decision')
    })
  })

  describe('onChange', () => {
    beforeEach(() => spyOn(browserHistory, 'push'))

    it('updates browser history', () => {
      const component = shallow(<ScreeningsFilter/>).instance()
      component.onChange({'screening_decisions[]': ['b', 'c']})
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: '/screenings',
        query: {'screening_decisions[]': ['b', 'c']},
      })
    })
  })
})
