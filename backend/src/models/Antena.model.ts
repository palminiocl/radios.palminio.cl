import type { FrequencyUnit, SignalType } from './enums';
import Infraestructure from './Infraestructure.model';
import { GeographicLocation } from './GeographicLocation.model';
export class Antena extends Infraestructure {
    constructor(
        private _signalCode: string,
        private _frequency: string,
        private _power: number,
        private _installedAt: Date,
        private _datum: string,
        private _zoneService: string,
        private _signalType: SignalType,
        private _frequencyUnit: FrequencyUnit,
        protected location: GeographicLocation) {
        super(location);
    }
}