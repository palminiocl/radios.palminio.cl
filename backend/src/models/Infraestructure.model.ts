import type { Locatable } from "./GeographicLocation.model";
import { GeographicLocation } from "./GeographicLocation.model";
abstract class Infraestructure implements Locatable{
    constructor(private _location: GeographicLocation) {}

    get Location(): GeographicLocation {
        return this._location;
    }

    set Location(ubicacion: GeographicLocation) {
        this._location = ubicacion;
    }

}


export default Infraestructure;