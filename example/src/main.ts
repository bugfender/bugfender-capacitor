import { Bugfender } from '@bugfender/capacitor';
import { Capacitor } from '@capacitor/core';

import config from '../config.json';

console.log(Bugfender);

const bfPromise = Bugfender.init({
  appKey: config.appKey,
  overrideConsoleMethods: true,
  printToConsole: true,
});

console.log('aupa');
console.log(Capacitor.getPlatform());

Bugfender.getUserFeedback();
Bugfender.log('Hello from Capacitor!');
console.log('ok…');

bfPromise.then(async () => {
  console.log('Initialized');
  const sessionURL = await Bugfender.getSessionURL();
  document.write(`<a href="${sessionURL}">${sessionURL}</a>`);
});
