export interface OpenWeatherPlaceDto {
    country: string;
    lat: number;
    local_names: Record<string, string>;
    lon: number;
    name: string;
    state: string;
}
