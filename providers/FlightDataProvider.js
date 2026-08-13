/**
 * Base interface for Flight Data Providers
 */
class FlightDataProvider {
  /**
   * Initialize the provider
   */
  async init() {
    throw new Error('init() must be implemented');
  }

  /**
   * Fetch the latest departure flights
   * @returns {Promise<Array>} Array of flight objects
   */
  async fetchDepartures() {
    throw new Error('fetchDepartures() must be implemented');
  }
}

module.exports = FlightDataProvider;
