import { Injectable } from "@angular/core";
import { IDatepickerLocaleValues, defaultGBDatepickerLocaleValues } from "../../datepicker/localization";

export type Partial<T> = {
    [P in keyof T]?:Partial<T[P]>;
};

export interface ILocaleValues {
    datepicker:IDatepickerLocaleValues;
}

export type IPartialLocaleValues = Partial<ILocaleValues>;

interface ILocalizationValuesContainer {
    [name:string]:ILocaleValues;
}

@Injectable()
export class SuiLocalizationService {
    private _language:string;
    private _values:ILocalizationValuesContainer;

    public get language():string {
        return this._language;
    }

    constructor() {
        this.setLanguage("en-GB");

        this._values = {};

        this.setValues("en-GB", {
            datepicker: defaultGBDatepickerLocaleValues
        });
    }

    public setLanguage(language:string):void {
        this._language = language.toLowerCase();
    }

    public getValues(language?:string):ILocaleValues {
        const l = language || this._language;
        return this._values[l.toLowerCase()];
    }

    public setValues(language:string, values:ILocaleValues):void;
    public setValues(language:string, baseLanguage:string, values:IPartialLocaleValues):void;
    public setValues(language:string, baseLanguage:string | ILocaleValues, values?:IPartialLocaleValues):void {
        if (typeof baseLanguage === "string" && values) {

            this._values[language.toLowerCase()] = this.deepClone(this._values[language.toLowerCase()]);
            this.patchValues(language, values);

        } else if (typeof baseLanguage === "object") {

            this._values[language.toLowerCase()] = baseLanguage;
        }
    }

    public patchValues(language:string, values:IPartialLocaleValues):void {
        Object.assign(this._values[language.toLowerCase()], values);
    }

    private deepClone<T>(obj:T):T {
        return JSON.parse(JSON.stringify(obj));
    }
}