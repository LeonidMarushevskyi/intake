# frozen_string_literal: true

# Versions controller outputs the sha of the latest commit
# in the running application instance codebase
class VersionController < ApplicationController
  def index
    current_sha = `git rev-parse HEAD`.strip
    message = current_sha.present? ? current_sha : 'Git not found'
    render text: message
  end
end
