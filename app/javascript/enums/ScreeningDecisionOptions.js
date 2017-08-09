const SCREENING_DECISION_OPTIONS = Object.freeze({
  differential_response: {
    type: 'text',
    label: 'Service name',
  },
  information_to_child_welfare_services: {
    type: 'text',
    label: 'Staff name',
  },
  promote_to_referral: {
    type: 'select',
    label: 'Response time',
    values: {
      immediate: 'Immediate',
      '3_days': '3 days',
      '5_days': '5 days',
      '10_days': '10 days',
    },
  },
  screen_out: {
    type: 'select',
    label: 'Category',
    values: {
      evaluate_out: 'Evaluate out',
      information_request: 'Information request',
      consultation: 'Consultation',
      abandoned_call: 'Abandoned call',
      other: 'Other',
    },
  },
})

export default SCREENING_DECISION_OPTIONS
