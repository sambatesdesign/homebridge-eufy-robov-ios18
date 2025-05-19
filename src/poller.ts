import TuyAPI from 'tuyapi';
import { Logging } from 'homebridge';

export function startPolling(
  config: { id: string; key: string; ip?: string },
  log: Logging,
  updateSwitchState: (newState: boolean) => void,
  setCurrentState: (state: boolean) => void
) {
  const device = new TuyAPI({
    id: config.id,
    key: config.key,
    ip: config.ip,
    issueRefreshOnConnect: true,
  });

  const POLL_INTERVAL = 30000; // 30 seconds

  async function pollStatus() {
    try {
      if (!device.isConnected()) {
        await device.find();
        await device.connect();
        log.debug('Polling connected to RoboVac');
      }

      const dps = await device.refresh({}) as Record<string, any>;
      const workStatus = dps['15']; // e.g. "Running", "Recharge", "Idle"

      log.debug(`🔁 Poll DPS '15': ${workStatus}`);

      const isCleaning = workStatus === 'Running';
      updateSwitchState(isCleaning);
      setCurrentState(isCleaning); // 👈 also update internal state
    } catch (err) {
      log.warn('Polling error:', err);
    }
  }

  setInterval(pollStatus, POLL_INTERVAL);
  pollStatus(); // fire immediately once
}
