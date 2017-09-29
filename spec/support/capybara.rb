# frozen_string_literal: true

require 'capybara/rspec'
require 'support/capybara/screenshot'
require 'capybara/accessible'
require 'capybara/poltergeist'
Capybara.raise_server_errors = false

# Tests must be run in the correct timezone because
# of UTC converstion and explicit expectations.
# Sincerely,
# The Time Lords
ENV['TZ'] = 'Etc/GMT+7'

Capybara.default_driver = :accessible_selenium

# Allow aria-label to be used in locators
Capybara.enable_aria_label = true

Capybara::Accessible::Auditor::Node.class_eval do
  SELECTORS_TO_IGNORE = <<-IGNORES
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_cal]');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_input');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_time_listbox');
    config.ignoreSelectors('badAriaAttributeValue', '[id=spec_meta');
  IGNORES

  def perform_audit_script
    <<-JAVASCRIPT
    #{audit_rules}
        var config = new axs.AuditConfiguration();
        var severe_rules = #{severe_rules.to_json};
        var rule;
        for(rule in severe_rules) {
          config.setSeverity(severe_rules[rule], axs.constants.Severity.SEVERE);
        }
        config.auditRulesToIgnore = #{excluded_rules.to_json};
        #{SELECTORS_TO_IGNORE}
        var results = axs.Audit.run(config);
    JAVASCRIPT
  end
end

Capybara::Accessible::Auditor::Driver.class_eval do
  def perform_audit_script
    <<-JAVASCRIPT
    #{audit_rules}
        var config = new axs.AuditConfiguration();
        var severe_rules = #{severe_rules.to_json};
        var rule;
        for(rule in severe_rules) {
          config.setSeverity(severe_rules[rule], axs.constants.Severity.SEVERE);
        }
        config.auditRulesToIgnore = #{excluded_rules.to_json};
        #{SELECTORS_TO_IGNORE}
        var results = axs.Audit.run(config);
    JAVASCRIPT
  end
end
