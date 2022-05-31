import { Capacitor } from '@capacitor/core';
import { Bugfender } from '@bugfender/capacitor';
import config from '../config.json';

console.log('aupa');
console.log(Capacitor.getPlatform());
console.log(Bugfender);

Bugfender.getUserFeedback();
Bugfender.log('Hello from Capacitor!');

const bfPromise = Bugfender.init({
  appKey: config.appKey,
  overrideConsoleMethods: true,
  printToConsole: true,
});

console.log('ok…');

bfPromise.then(async () => {
  console.log('Initialized');
  const sessionURL = await Bugfender.getSessionURL();
  document.write(`<a href="${sessionURL}">${sessionURL}</a>`);
});
