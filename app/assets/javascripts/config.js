export function config() {
  return window.org.intake.config
}

export function isFeatureActive(feature) {
  return config().active_features.includes(feature)
}
