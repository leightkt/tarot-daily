class CreateCards < ActiveRecord::Migration[6.1]
  def change
    create_table :cards do |t|
      t.string :name
      t.string :name_short
      t.string :value
      t.string :value_int
      t.string :suit
      t.string :card_type
      t.string :meaning_up
      t.string :meaning_rev
      t.string :desc

      t.timestamps
    end
  end
end
