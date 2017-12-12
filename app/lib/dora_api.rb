# frozen_string_literal: true

# The connection object will be used to talk to the Intake API
class DoraAPI < JsonAPI
  class << self
    def api_url
      Rails.application.config.intake[:dora_api_url]
    end
  end
end
