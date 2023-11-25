import {CurrentConditions} from '../views/blocks/current-conditions/current-conditions.type';

export interface ConditionsAndZip {
    zip: string;
    data: CurrentConditions;
}
