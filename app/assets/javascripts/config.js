export function config() {
  return window.org.intake.config
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
