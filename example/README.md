# `@bugfender/capacitor` example

## Initial Setup

- Ensure that [NVM](https://github.com/nvm-sh/nvm) is installed
- `nvm install`: Install the required Node.js version
- `nvm use`: Ensure correct Node.js version is in use
- `npm ci`: Install the dependencies
- `cp config.json.example config.json`: Create the config file
- Fill `config.json`

## Running this example

- `nvm use`: Ensure correct Node.js version is in use
- `./build.sh`: build root project, example project & sync android/ios projects
- To run, in the `example` project:
  - Web: `npm run serve`
  - Android: `npx cap run android`
  - iOS: `npx cap run ios`
