# frozen_string_literal: true

# MappingBase contains the shared logive for LOV mappings
class MappingBase
  def self.find_id(description:)
    find(description).try!(:id)
  end

  def self.find_logical_id(description:)
    find(description).try!(:logical_id)
  end

  def self.find(description)
    return nil if mapped_description(description).nil?
    SystemCode.find_by!(
      category_id: legacy_category_id,
      description: mapped_description(description),
      sub_category_id: nil
      # sub_category_id is a foreign key used on child values to reference the parent
      # we always want to send the parent value, not the children
    )
  end
  private_class_method :find

  def self.legacy_category_id(category_id = nil)
    @category_id = category_id unless category_id.nil?
    @category_id
  end
  private_class_method :legacy_category_id

  def self.legacy_description_mapping(description_mapping = nil)
    @description_mapping = description_mapping unless description_mapping.nil?
    @description_mapping
  end
  private_class_method :legacy_description_mapping

  def self.mapped_description(description)
    legacy_description_mapping[description]
  end
  private_class_method :mapped_description
end
