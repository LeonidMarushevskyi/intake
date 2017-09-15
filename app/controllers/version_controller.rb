# frozen_string_literal: true

# Versions controller outputs the sha of the latest commit
# in the running application instance codebase
class VersionController < ApplicationController
  def index
    current_sha = `git rev-parse HEAD`.strip
    message = { version: current_sha.present? ? current_sha : 'Git not found' }
              .merge(Rails.configuration.intake)
              .merge(active_features: Feature.active_features)
    render json: JSON.pretty_generate(message)
  end
end
