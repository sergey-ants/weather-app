export interface OpenWeatherForecastAlertsDto {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
}
