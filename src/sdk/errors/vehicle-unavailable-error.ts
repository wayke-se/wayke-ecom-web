export class VehicleUnavailableError extends Error {
  constructor() {
    super('The vehicle is not available for purchase');

    Object.setPrototypeOf(this, VehicleUnavailableError.prototype);
  }
}
