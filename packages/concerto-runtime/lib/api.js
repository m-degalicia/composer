/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const AssetRegistry = require('./api/assetregistry');
const Factory = require('./api/factory');
const Logger = require('@ibm/concerto-common').Logger;
const ParticipantRegistry = require('./api/participantregistry');

const LOG = Logger.getLog('Api');

/**
 * A class that contains the root of the transaction processor API. Methods in this
 * class are made available as global functions which can be called by transaction
 * processor functions. The transaction processor API should expose no internal
 * properties or internal methods which could be accessed or misused.
 * @private
 * @class
 * @memberof module:concerto-runtime
 */
class Api {

    /**
     * Constructor.
     * @param {Factory} factory The factory to use.
     * @param {Resource} participant The current participant.
     * @param {RegistryManager} registryManager The registry manager to use.
     * @private
     */
    constructor(factory, participant, registryManager) {
        const method = 'constructor';
        LOG.entry(method, factory, participant, registryManager);

        /**
         * Get the factory. The factory can be used to create new instances of
         * assets, participants, and transactions for storing in registries. The
         * factory can also be used for creating relationships to assets, particpants,
         * and transactions.
         * @example
         * // Get the factory.
         * var factory = getFactory();
         * @method module:concerto-runtime#getFactory
         * @public
         * @return {module:concerto-runtime.Factory} The factory.
         */
        this.getFactory = function getFactory() {
            const method = 'getFactory';
            LOG.entry(method);
            let result = new Factory(factory);
            LOG.exit(method, result);
            return result;
        };

        /**
         * Get an existing asset registry using the unique identifier of the asset
         * registry. An asset registry can be used to retrieve, update, or delete
         * existing assets, or create new assets.
         * @example
         * // Get the vehicle asset registry.
         * return getAssetRegistry('org.acme.Vehicle')
         *   .then(function (vehicleAssetRegistry) {
         *     // Call methods on the vehicle asset registry.
         *   })
         *   .catch(function (error) {
         *     // Add optional error handling here.
         *   });
         * @method module:concerto-runtime#getAssetRegistry
         * @public
         * @param {string} id The ID of the asset registry.
         * @return {Promise} A promise. The promise is resolved with an {@link
         * module:concerto-runtime.AssetRegistry AssetRegistry} instance
         * representing the asset registry if it exists. If the asset registry
         * does not exist, or the current user does not have access to the asset
         * registry, then the promise will be rejected with an error that describes
         * the problem.
         */
        this.getAssetRegistry = function getAssetRegistry(id) {
            const method = 'getAssetRegistry';
            LOG.entry(method, id);
            return registryManager.get('Asset', id)
                .then((registry) => {
                    let result = new AssetRegistry(registry);
                    LOG.exit(method, result);
                    return result;
                });
        };

        /**
         * Get an existing participant registry using the unique identifier of the participant
         * registry. An participant registry can be used to retrieve, update, or delete
         * existing participants, or create new participants.
         * @example
         * // Get the driver participant registry.
         * return getParticipantRegistry('org.acme.Driver')
         *   .then(function (driverParticipantRegistry) {
         *     // Call methods on the driver participant registry.
         *   })
         *   .catch(function (error) {
         *     // Add optional error handling here.
         *   });
         * @method module:concerto-runtime#getParticipantRegistry
         * @public
         * @param {string} id The ID of the participant registry.
         * @return {Promise} A promise. The promise is resolved with an {@link
         * module:concerto-runtime.ParticipantRegistry ParticipantRegistry} instance
         * representing the participant registry if it exists. If the participant registry
         * does not exist, or the current user does not have access to the participant
         * registry, then the promise will be rejected with an error that describes
         * the problem.
         */
        this.getParticipantRegistry = function getParticipantRegistry(id) {
            const method = 'getParticipantRegistry';
            LOG.entry(method, id);
            return registryManager.get('Participant', id)
                .then((registry) => {
                    let result = new ParticipantRegistry(registry);
                    LOG.exit(method, result);
                    return result;
                });
        };

        /**
         * Get the current participant. The current participant is determined by
         * the identity that was used to submit the current transaction.
         * @example
         * // Get the current participant.
         * var currentParticipant = getCurrentParticipant();
         * // Check to see if the current participant is a driver.
         * if (currentParticipant.getFullyQualifiedType() !== 'org.acme.Driver') {
         *   // Throw an error as the current participant is not a driver.
         *   throw new Error('Current participant is not a driver');
         * }
         * // Check to see if the current participant is the first driver.
         * if (currentParticipant.getFullyQualifiedIdentifier() !== 'org.acme.Driver#DRIVER_1') {
         *   // Throw an error as the current participant is not a driver.
         *   throw new Error('Current participant is not the first driver');
         * }
         * @method module:concerto-runtime#getCurrentParticipant
         * @public
         * @return {module:concerto-common.Resource} The current participant,
         * or null if the transaction was submitted using an identity that does
         * not map to a participant.
         */
        this.getCurrentParticipant = function getCurrentParticipant() {
            const method = 'getCurrentParticipant';
            LOG.entry(method);
            let result = participant;
            LOG.exit(method, result);
            return result;
        };

        Object.freeze(this);
        LOG.exit(method);
    }

}

module.exports = Api;
