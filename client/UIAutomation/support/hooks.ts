import { After, setDefaultTimeout, Status } from 'cucumber';
import { browser } from 'protractor';
import { getConsoleErrors } from '../shared/helpers/pagehelper';

setDefaultTimeout(300 * 1000);

After(function(testCase) {
    if (testCase.result.status === Status.FAILED) {
        getConsoleErrors().then(logs => logs && this.attach(logs.map(entry => entry.message).join(';\n'), 'text/plain'));
        return browser.takeScreenshot().then(screenShot => this.attach(screenShot, 'image/png'));
    }
});