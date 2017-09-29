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

Capybara.register_driver :accessible_selenium do |app|
  capabilities = Selenium::WebDriver::Remote::Capabilities.firefox(
    marionette: ENV['MARIONETTE'] == 'true'
  )
  driver = Capybara::Selenium::Driver.new(
    app,
    browser: :firefox,
    desired_capabilities: capabilities
  )
  adaptor = Capybara::Accessible::SeleniumDriverAdapter.new
  Capybara::Accessible.setup(driver, adaptor)
end

Capybara.register_driver :accessible_poltergeist do |app|
  driver = Capybara::Poltergeist::Driver.new(app, js_errors: false)
  adaptor = Capybara::Accessible::PoltergeistDriverAdapter.new
  Capybara::Accessible.setup(driver, adaptor)
end

Capybara.default_driver = :accessible_selenium

Capybara.server_port = 8889 + ENV['TEST_ENV_NUMBER'].to_i

# Allow aria-label to be used in locators
Capybara.enable_aria_label = true

module Capybara
  module Accessible
    class SeleniumDriverAdapter
      def modal_dialog_present?(driver)
        driver.browser.switch_to.alert
        true
      rescue ::Selenium::WebDriver::Error::NoSuchAlertError, ::NoMethodError
        false
      end
    end
  end
end

Capybara::Accessible::Auditor::Node.class_eval do
  SELECTORS_TO_IGNORE = <<-IGNORES
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_cal]');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_input]');
    config.ignoreSelectors('badAriaAttributeValue', '[id$=_time_listbox]');
    config.ignoreSelectors('badAriaAttributeValue', '[id=spec_meta]');
    config.ignoreSelectors('badAriaAttributeValue', '[id=spec_meta]');
    config.ignoreSelectors('badAriaAttributeValue', '[class^=Select]');
    config.ignoreSelectors('badAriaAttributeValue', 'option');
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
