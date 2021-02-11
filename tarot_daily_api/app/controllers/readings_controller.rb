class ReadingsController < ApplicationController

    def index
        @readings = Reading.all
        render json: @readings, include: [:user, :card]
    end

    def show
        @reading = Reading.find(params[:id])
        render json: @reading, include: :card
    end
    
    def create
        @reading = Reading.new(reading_params)
        if @reading.valid?
            @reading.date = Time.now.to_s.split(' ')[0]
            @reading.save
            render json: @reading
        else
            render json: {errors: @reading.errors.full_messages}, status: :unprocessable_entity
        end
    end

    def destroy
        @reading = Reading.find(params[:id])
        @reading.destroy
        render json: {Message: "Reading ##{@reading.id} destoryed"}
    end

    private

    def reading_params
        params.require(:reading).permit(:question, :user_id, :card_id, :direction)
    end
end
