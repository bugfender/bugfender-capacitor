import { Capacitor } from '@capacitor/core';
import { Bugfender } from '@bugfender/capacitor';

console.log('aupa');
console.log(Capacitor.getPlatform());
console.log(Bugfender);

Bugfender.getUserFeedback();
Bugfender.log('Hello from Capacitor!');

const bfPromise = Bugfender.init({
  appKey: '',
  overrideConsoleMethods: true,
  printToConsole: true,
});

console.log('ok…');

bfPromise.then(async () => {
  console.log('Initialized');
  const sessionURL = await Bugfender.getSessionURL();
  document.write(`<a href="${sessionURL}">${sessionURL}</a>`);
});
