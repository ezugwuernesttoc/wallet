/* tslint:disable */
/* eslint-disable */
/**
 * REST api to TON blockchain explorer
 * Provide access to indexed TON blockchain
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: contact@fslabs.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { AccountEvent } from './AccountEvent';
import {
    AccountEventFromJSON,
    AccountEventFromJSONTyped,
    AccountEventToJSON,
} from './AccountEvent';

/**
 * 
 * @export
 * @interface AccountEvents
 */
export interface AccountEvents {
    /**
     * 
     * @type {Array<AccountEvent>}
     * @memberof AccountEvents
     */
    events: Array<AccountEvent>;
    /**
     * 
     * @type {number}
     * @memberof AccountEvents
     */
    nextFrom: number;
}

/**
 * Check if a given object implements the AccountEvents interface.
 */
export function instanceOfAccountEvents(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "events" in value;
    isInstance = isInstance && "nextFrom" in value;

    return isInstance;
}

export function AccountEventsFromJSON(json: any): AccountEvents {
    return AccountEventsFromJSONTyped(json, false);
}

export function AccountEventsFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountEvents {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'events': ((json['events'] as Array<any>).map(AccountEventFromJSON)),
        'nextFrom': json['next_from'],
    };
}

export function AccountEventsToJSON(value?: AccountEvents | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'events': ((value.events as Array<any>).map(AccountEventToJSON)),
        'next_from': value.nextFrom,
    };
}

