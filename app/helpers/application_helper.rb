# frozen_string_literal: true

module ApplicationHelper # :nodoc:
  def format_date(value)
    Date.parse(value).strftime('%m/%d/%Y') if value
  end
end
