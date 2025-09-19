import type { Antena } from "./Antena.model";
import type { GeographicLocation } from "./GeographicLocation.model";
import Infraestructure from "./Infraestructure.model";

export class Radio extends Infraestructure {
    private _antenas: Antena[] = [];
    constructor(
        private _name: string,
        protected location: GeographicLocation
    ) {
        super(location);
    }

    get Name(): string {
        return this._name;
    }
    set Name(name: string) {
        this._name = name;
    }
    get Location(): GeographicLocation {
        return this.location;
    }
    set Location(location: GeographicLocation) {
        this.location = location;
    }

    addAntena(antena: Antena): void {
        this._antenas.push(antena);
    }
}