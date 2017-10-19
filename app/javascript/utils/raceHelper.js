import Immutable from 'immutable'

function bestMatchForRace(races, targetRace) {
  const candidates = races.reduce(
    (results, candidate) => {
      if (candidate.get('race') === targetRace) {
        return results.concat(candidate)
      }
      return results
    }, []
  )
  const candidateDetail = candidates.reduce((result, item) => result || item.get('race_detail'), null)
  if (candidateDetail) {
    return Immutable.fromJS({race: targetRace, race_detail: candidateDetail})
  } else {
    return candidates[0]
  }
}

export default function bestMatchesByRace(races) {
  const keys = races.map((race) => race.get('race')).toSet().toList()
  return keys.map((key) => bestMatchForRace(races, key))
}
