import type { Radio } from "./Radio.model";

export class Concesionario {
    private _radios: Radio[] = [];
    
    constructor(
        private _name: string,
        private _rut: string
    ) {}

    get Name(): string {
        return this._name;
    }
    
    get Rut(): string {
        return this._rut;
    }

    set Name(name: string) {
        this._name = name;
    }

    set Rut(rut: string) {
       this._rut = rut;
    }
    
    get Radios(): Radio[] {
        return this._radios;
    }

    addRadio(radio: Radio): void {
        this._radios.push(radio);
    }
}