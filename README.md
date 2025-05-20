# homebridge-eufy-minimal

A super lightweight [Homebridge](https://homebridge.io) plugin for basic control of Eufy RoboVac cleaners via Tuya local control.

> Start and dock your RoboVac with a simple switch in the Apple Home app.

---

## ✨ Features

- ✅ Start cleaning with a HomeKit switch
- ✅ Send the RoboVac back to its dock
- ✅ No cloud dependency – works locally via [TuyAPI](https://github.com/codetheweb/tuyapi)
- ✅ Simple, stable, and private

---

## 🚫 Limitations

- ❌ No real-time status updates (no polling or feedback)
- ❌ Does not sync when RoboVac is started manually or from the Eufy app
- ❌ Only supports RoboVacs that can be controlled locally over Tuya

---

## 🧰 Installation

1. Clone or copy this plugin into a local folder:
   ```bash
   git clone https://github.com/yourusername/homebridge-eufy-minimal.git
   cd homebridge-eufy-minimal
   npm install
   npm run build
   npm link
   ```

2. Add the accessory to your Homebridge `config.json`:

```json
{
  "accessories": [
    {
      "accessory": "EufyRoboVac",
      "name": "Vacuum Cleaner",
      "deviceId": "YOUR_DEVICE_ID",
      "localKey": "YOUR_LOCAL_KEY",
      "ip": "YOUR_DEVICE_IP"
    }
  ]
}
```

---

## 🔍 Finding Your Device ID and Local Key

You can extract these using tools like:

- [Tuya-cli wizard](https://github.com/TuyaAPI/cli)
- [Home Assistant Tuya Local](https://github.com/rospogrigio/localtuya)

Make sure your RoboVac is registered in the Tuya app (not just Eufy app), and that it supports local control.

---

## 🧼 Example Use

Once added, you'll see a simple switch in HomeKit:

- **Toggle ON** → starts cleaning
- **Toggle OFF** → sends the vacuum to dock

---

## 🛠 Development

You can test the plugin using:

```bash
npm run build
homebridge -I -D
```

- `-I` = insecure mode (to bypass pairing)
- `-D` = debug logs

---

## 🤝 Credits

- Built using [TuyAPI](https://github.com/codetheweb/tuyapi)
- Inspired by community reverse-engineering of Eufy/Tuya devices

---

## 📜 License

MIT
