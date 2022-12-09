import {Bugfender} from '@bugfender/capacitor';
import type {UserFeedbackResult} from "@bugfender/common";
import {LogLevel} from "@bugfender/common";
import {Capacitor} from '@capacitor/core';

import config from '../config.json';

console.log(Bugfender);

const bfPromise = Bugfender.init({
  appKey: config.appKey,
  overrideConsoleMethods: true,
  printToConsole: true,
  registerErrorHandler: true,
});

console.log("Executing on %s", Capacitor.getPlatform());
Bugfender.log('Hello from Capacitor!');

bfPromise.then(async () => {
  console.log('Bugfender initialized');

  (document.getElementById("session_url_link") as HTMLLinkElement).href = await Bugfender.getSessionURL();
  (document.getElementById("device_url_link") as HTMLLinkElement).href = await Bugfender.getDeviceURL();
});

document.getElementById("send_logs_btn")?.addEventListener("click", function () {
  Bugfender.sendLog({
    level: LogLevel.Debug,
    tag: 'REACT',
    text: 'Im being called from Capacitor!',
  });

  Bugfender.log('Log without break lines in the middle of the message');
  Bugfender.log('Log with break lines \n\n in the middle of the message');
  Bugfender.warn('Warn log');
  Bugfender.error('Error log');
  Bugfender.fatal('Fatal log');
  Bugfender.trace('Trace log');
  Bugfender.info('Info log');

  console.log('Log from console');
  console.warn('Warn log from console');
  console.error('Error log from console');
  console.debug('Debug log from console');
  console.trace('Trace log from console');
  console.info('Info log from console');

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Debug,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level debug log.',
  });

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Error,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level error log.',
  });

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Warning,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level warn log.',
  });

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Fatal,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level fatal log.',
  });

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Info,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level info log.',
  });

  Bugfender.sendLog({
    line: 1001,
    level: LogLevel.Trace,
    tag: 'tag',
    method: 'method',
    file: 'file',
    text: 'Sending low level trace log.',
  });

  Bugfender.setDeviceKey('device.key.string', 'fake.string.value');
  Bugfender.setDeviceKey('device.key.boolean', true);
  Bugfender.setDeviceKey('device.key.float', 10.1);
  Bugfender.setDeviceKey('device.key.integer', 102);
  Bugfender.setDeviceKey('device.key.integer2', 104);
  Bugfender.removeDeviceKey('device.key.integer2');

  Bugfender.sendIssue('Issue One', 'Issue Message One').then((url: string) =>
    console.log('Issue url: %s', url)
  );
  Bugfender.sendIssue('Issue Two', 'Issue Message Two').then((url: string) =>
    console.log('Issue url: %s', url)
  );
  Bugfender.sendIssue('Issue Three', 'Issue Message Three').then((url: string) =>
    console.log('Issue url: %s', url)
  );
  Bugfender.sendCrash('Crash title', 'Crash text').then((url: string) =>
    console.log('Crash url: %s', url)
  );
  Bugfender.sendUserFeedback('User feedback', 'User feedback message').then((url: string) =>
    console.log('Feedback url: %s', url)
  );
  Bugfender.getDeviceURL().then((url: string) => console.log('Device url: %s', url));
  Bugfender.getSessionURL().then((url: string) => console.log('Session url: %s', url));

  Bugfender.forceSendOnce();

  Bugfender.setForceEnabled(true);

  Bugfender.setForceEnabled(false);
});

document.getElementById("generate_js_crash_btn")?.addEventListener("click", function () {
  // Force crash
  const date = new Date(); //Current Date
  const hours = date.getHours(); //Current Hours
  const min = date.getMinutes(); //Current Minutes
  const sec = date.getSeconds(); //Current Seconds
  throw new Error('Force crash' + 'Time: ' + hours + ':' + min + ':' + sec);

})

document.getElementById("native_feedback_btn")?.addEventListener("click", function () {
  Bugfender.getUserFeedback({
    title: 'Feedback',
    // hint: 'Please send us your feedback',
    // subjectPlaceholder: 'This is the reason',
    // feedbackPlaceholder: 'This is the full message',
    // submitLabel: 'Send',
    // closeLabel: 'Cancel',
  }).then((response: UserFeedbackResult) => {
    if (response.isSent) {
      console.log('Feedback sent with url:', response.feedbackURL);
    } else {
      console.log('Feedback not sent');
    }
  });
})

document.getElementById('console_compat_logtext_btn')?.addEventListener('click', () => {
  Bugfender.sendLog({
    text: ['This is a console.* template: %s', 'value']
  });

  Bugfender.sendLog({
    text: ['Just handles array of mixed values', true, 42, { foo: 'bar' }]
  });
});
