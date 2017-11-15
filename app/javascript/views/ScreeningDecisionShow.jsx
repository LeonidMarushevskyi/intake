import EditLink from 'common/EditLink'
import React from 'react'
import PropTypes from 'prop-types'
import ShowField from 'common/ShowField'

const ScreeningDecisionShow = ({
  accessRestriction,
  additionalInformation,
  decision,
  decisionDetail,
  onEdit,
  restrictionRationale,
  sdmPath,
}) => (
  <div className='card show double-gap-top' id='decision-card'>
    <div className='card-header'>
      <span>Decision</span>
      {onEdit &&
        <EditLink
          ariaLabel={'Edit decision'}
          onClick={(event) => {
            event.preventDefault()
            onEdit()
          }}
        />
      }
    </div>
    <div className='card-body'>
      <div className='row'>
        <div className='col-md-6'>
          <ShowField label='Screening decision' errors={decision.errors} required>
            {decision.value}
          </ShowField>
          <ShowField
            label={decisionDetail.label}
            required={decisionDetail.required}
            errors={decisionDetail.errors}
          >
            {decisionDetail.value}
          </ShowField>
        </div>
        <div className='col-md-6'>
          <p className='double-gap-top'><strong>SDM Hotline Tool</strong></p>
          <div>Determine Decision and Response Time by using Structured Decision Making.</div>
          <a href={sdmPath} target='_blank' id='complete_sdm'>Complete SDM</a>
        </div>
      </div>
      <div className='row'>
        <div className='col-md-12'>
          <ShowField label='Additional information'>
            {additionalInformation.value}
          </ShowField>
          <ShowField label='Access restrictions'>
            {accessRestriction.value}
          </ShowField>
          {restrictionRationale.value &&
            <ShowField label='Restrictions rationale' required>
              {restrictionRationale.value}
            </ShowField>
          }
        </div>
      </div>
    </div>
  </div>
)

ScreeningDecisionShow.propTypes = {
  accessRestriction: PropTypes.shape({
    value: PropTypes.string,
  }),
  additionalInformation: PropTypes.shape({
    value: PropTypes.string,
  }),
  decision: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.string,
  }),
  decisionDetail: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.string),
    label: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.string,
  }),
  onEdit: PropTypes.func,
  restrictionRationale: PropTypes.shape({
    value: PropTypes.string,
  }),
  sdmPath: PropTypes.string,
}

export default ScreeningDecisionShow
