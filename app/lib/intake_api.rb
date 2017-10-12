# frozen_string_literal: true

# The connection object will be used to talk to the Intake API
class IntakeAPI < JsonAPI
  class << self
    def api_url
      Rails.application.config.intake[:api_url]
    end
  end
end
