class CreateReadings < ActiveRecord::Migration[6.1]
  def change
    create_table :readings do |t|
      t.string :date
      t.string :question
      t.references :user, null: false, foreign_key: true
      t.references :card, null: false, foreign_key: true
      t.string :direction

      t.timestamps
    end
  end
end
