import ALLEGATION_TYPES from 'enums/AllegationTypes'

const atRiskType = 'At risk, sibling abused'

export function hasAtRiskAllegation(allegation) {
  return allegation.get('allegationTypes').contains(atRiskType)
}

export function hasAtRiskableAllegation(allegation) {
  return !allegation.get('allegationTypes').filterNot((type) =>
    type === atRiskType
  ).isEmpty()
}

export function findComplementaryAllegationsForAtRisk(atRiskAllegation, allegations) {
  return allegations.filter((allegation) =>
    allegation.get('victimId') !== atRiskAllegation.get('victimId') &&
    allegation.get('perpetratorId') === atRiskAllegation.get('perpetratorId') &&
    hasAtRiskableAllegation(allegation))
}

export function siblingAtRiskHasRequiredComplementaryAllegations(allegations) {
  return !allegations.some((allegation, key) => {
    const allOtherAllegations = allegations.filterNot((_, ky) => ky === key)
    const complementaryAllegations = findComplementaryAllegationsForAtRisk(allegation, allOtherAllegations)
    return hasAtRiskAllegation(allegation) && complementaryAllegations.isEmpty()
  })
}

export function areCrossReportsRequired(allegations) {
  if (!allegations || allegations.isEmpty()) return false
  const allegationsRequiringReports = ALLEGATION_TYPES
    .filter((type) => type.requiresCrossReport)
    .map((type) => (type.value))

  const allAllegationTypes = allegations.map((a) => a.get('allegationTypes')).flatten()
  return !allAllegationTypes.toSet().intersect(allegationsRequiringReports).isEmpty()
}

export function areAllegationsRequired({screening_decision}) {
  return screening_decision === 'promote_to_referral'
}
