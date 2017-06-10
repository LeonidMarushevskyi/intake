# frozen_string_literal: true

module ConfigHelper
  def with_config(config)
    original_config = Rails.configuration.intake.dup
    Rails.configuration.intake = original_config.merge(config)
    yield
    Rails.configuration.intake = original_config
  end
end

RSpec.configure do |config|
  config.include ConfigHelper, type: :feature
end
