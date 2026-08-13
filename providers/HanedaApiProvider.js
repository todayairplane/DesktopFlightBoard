const { exec } = require('child_process');
const path = require('path');
const FlightDataProvider = require('./FlightDataProvider');

class HanedaApiProvider extends FlightDataProvider {
  constructor() {
    super();
    this.flights = [];
    // Assuming the app is run from the project root where venv is located
    this.pythonCommand = path.join(process.cwd(), 'venv', 'bin', 'python3');
    this.scriptPath = path.join(process.cwd(), 'python_scripts', 'fetch_flights.py');
    this.airportCode = 'HND';
  }

  setAirport(code) {
    this.airportCode = code;
  }

  async init() {
    console.log(`Initializing HanedaApiProvider (FlightRadarAPI) for ${this.airportCode}...`);
    // Optionally fetch initial data here
    await this.fetchDepartures();
  }

  async fetchDepartures() {
    return new Promise((resolve, reject) => {
      // Execute the python script
      exec(`"${this.pythonCommand}" "${this.scriptPath}" "${this.airportCode}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        
        try {
          const rawFlights = JSON.parse(stdout);
          
          // Convert Unix timestamps to Date objects
          const now = new Date();
          this.flights = rawFlights.map(f => {
            return {
              ...f,
              scheduleTime: new Date(f.scheduleTime * 1000),
              estimatedTime: f.estimatedTime ? new Date(f.estimatedTime * 1000) : null,
              // Fallback codeshare processing - in FR24 we only get codeshare flight number,
              // so we guess the airline code (usually first two chars)
              codeshareAirline: f.codeshareNumber ? { code: f.codeshareNumber.substring(0, 2) } : null
            };
          });

          // Filter out flights that departed more than 1 hour ago
          this.flights = this.flights.filter(f => {
            const timeToCheck = f.estimatedTime || f.scheduleTime;
            return (now.getTime() - timeToCheck.getTime()) < 60 * 60000;
          });

          // Sort by schedule time
          this.flights.sort((a, b) => a.scheduleTime - b.scheduleTime);
          
          resolve(this.flights);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Raw Output:', stdout);
          reject(parseError);
        }
      });
    });
  }
}

module.exports = HanedaApiProvider;
