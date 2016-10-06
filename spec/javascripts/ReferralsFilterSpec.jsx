import CheckboxListFilter from 'CheckboxListFilter'
import React from 'react'
import ReferralsFilter from 'ReferralsFilter'
import ResponseTime from 'ResponseTime'
import ScreeningDecision from 'ScreeningDecision'
import {browserHistory} from 'react-router'
import {mount, shallow} from 'enzyme';

describe('ReferralsFilter', () => {
  describe('render', () => {
    it('contains an checkbox list filter component for response times', function () {
      const wrapper = mount(<ReferralsFilter/>)
      expect(wrapper.find(CheckboxListFilter).length).toEqual(2)
      expect(wrapper.find(CheckboxListFilter).nodes[0].props.name).toEqual('response-time')
      expect(wrapper.find(CheckboxListFilter).nodes[0].props.collection).toEqual(ResponseTime)
      expect(wrapper.find(CheckboxListFilter).nodes[0].props.legend).toEqual('Response Time')
    })

    it('contains an checkbox list filter component for screening decisions', function () {
      const wrapper = mount(<ReferralsFilter/>)
      expect(wrapper.find(CheckboxListFilter).length).toEqual(2)
      expect(wrapper.find(CheckboxListFilter).nodes[1].props.name).toEqual('screening-decision')
      expect(wrapper.find(CheckboxListFilter).nodes[1].props.collection).toEqual(ScreeningDecision)
      expect(wrapper.find(CheckboxListFilter).nodes[1].props.legend).toEqual('Decision')
    })
  })

  describe('onChange', () => {
    beforeEach(() => spyOn(browserHistory, 'push'))

    it('updates browser history', () => {
      const wrapper = shallow(<ReferralsFilter/>).instance()
      wrapper.onChange({'response_times[]': ['a'], 'screening_decisions[]': ['b', 'c']})
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: '/referrals',
        query: {'response_times[]': ['a'], 'screening_decisions[]': ['b', 'c']},
      })
    })
  })
})
