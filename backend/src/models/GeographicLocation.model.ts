export interface Locatable {
    get Location(): GeographicLocation;
}

export class GeographicLocation {
    constructor(
        private _direccion: string,
        private _comuna: string,
        private _region: string,
        private _latitude: number,
        private _longitude: number,
    ) {}

    get Ubicacion(): GeographicLocation {
        return this;
    }
    get Direccion(): string {
        return this._direccion;
    }
    get Comuna(): string {
        return this._comuna;
    }
    get Region(): string {
        return this._region;
    }
    set Direccion(direccion: string) {
        this._direccion = direccion;
    }
    set Comuna(comuna: string) {
        this._comuna = comuna;
    }
    set Region(region: string) {
        this._region = region;
    }
    get Latitude(): number {
        return this._latitude;
    }
    get Longitude(): number {
        return this._longitude;
    }
    set Latitude(latitude: number) {
        this._latitude = latitude;
    }
    set Longitude(longitude: number) {
        this._longitude = longitude;
    }
}