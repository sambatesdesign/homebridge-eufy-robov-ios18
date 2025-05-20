import {
  API,
  AccessoryPlugin,
  Logging,
  HAP,
  AccessoryConfig,
  Service,
  CharacteristicValue,
  CharacteristicSetCallback,
  CharacteristicGetCallback,
} from 'homebridge';
import TuyAPI from 'tuyapi';

let hap: HAP;

export = (api: API) => {
  hap = api.hap;
  api.registerAccessory('homebridge-eufy-minimal', 'EufyRoboVac', EufyRoboVacAccessory);
};

class EufyRoboVacAccessory implements AccessoryPlugin {
  private readonly log: Logging;
  private readonly name: string;
  private readonly config: { id: string; key: string; ip?: string };
  private readonly service: Service;
  private readonly informationService: Service;
  private currentState: boolean = false;

  constructor(log: Logging, config: AccessoryConfig) {
    this.log = log;
    this.name = config.name;
    this.config = {
      id: config.deviceId,
      key: config.localKey,
      ip: config.ip,
    };

    this.service = new hap.Service.Switch(this.name);
    this.service
      .getCharacteristic(hap.Characteristic.On)
      .on(hap.CharacteristicEventTypes.GET, this.handleGetActive.bind(this))
      .on(hap.CharacteristicEventTypes.SET, this.handleSetActive.bind(this));

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, 'Eufy')
      .setCharacteristic(hap.Characteristic.Model, 'RoboVac');

    this.log.info(`${this.name} accessory created.`);
  }

  async handleGetActive(callback: CharacteristicGetCallback) {
    this.log.warn('handleGetActive called');
    callback(null, this.currentState);
  }

  async handleSetActive(value: CharacteristicValue, callback: CharacteristicSetCallback) {
    this.log.warn(`⚙️ handleSetActive fired with value: ${value}`);

    const device = new TuyAPI({
      id: this.config.id,
      key: this.config.key,
      issueRefreshOnConnect: true,
    });

    try {
      this.log.warn('Finding and connecting...');
      await device.find();
      await device.connect();
      this.log.warn(`Connected to RoboVac`);

      if (value) {
        this.log.warn('🧹 Sending start sequence...');
        device.set({ dps: 1, set: true }).catch(() => {});
        device.set({ dps: 2, set: true }).catch(() => {});
        device.set({ dps: 5, set: 'auto' }).catch(() => {});
        device.set({ dps: 122, set: 'Continue' }).catch(() => {});
        this.log.warn('✅ Start sequence sent');
        this.currentState = true;
      } else {
        this.log.warn('🏠 Sending stop and dock...');
        device.set({ dps: 2, set: false }).catch(() => {});
        device.set({ dps: 101, set: true }).catch(() => {});
        this.log.warn('✅ Dock command sent');
        this.currentState = false;
      }

      setTimeout(() => device.disconnect(), 5000);
      callback();
    } catch (err) {
      this.log.error('❌ Failed to run vac command:', err);
      callback(err as Error);
    }
  }

  identify(): void {
    this.log('Identify requested');
  }

  getServices(): Service[] {
    return [this.informationService, this.service];
  }
}
