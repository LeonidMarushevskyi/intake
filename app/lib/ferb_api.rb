# frozen_string_literal: true

# The connection object will be used to talk to the Intake API
class FerbAPI < JsonAPI
  class << self
    attr_accessor :connection
  end
end
