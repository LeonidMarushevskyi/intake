# frozen_string_literal: true

# Contacts Controller handles the requests for the
# creation and modification of investigation contacts
class ContactsController < ApplicationController
  before_action :authenticate_user, if: :authentication_enabled?

  def new; end
end
