export function config() {
  const {org: {intake: {config = {}} = {}} = {}} = window
  return config
}

export function isFeatureActive(feature) {
  return config().active_features.includes(feature)
}

export function isFeatureInactive(feature) {
  return !isFeatureActive(feature)
}

export function jsClipboardSupported() {
  return window.clipboardData === undefined
}

export function basePath() {
  return config().base_path
}

export function sdmPath() {
  return config().sdm_path
}
