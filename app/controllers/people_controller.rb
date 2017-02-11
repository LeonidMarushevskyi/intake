# frozen_string_literal: true

# People Controller handles all service request for
# the creation and modification of person objects.
class PeopleController < ApplicationController
  def new
    render :show
  end

  def edit
    render :show
  end

  def show
    render :show
  end
end
