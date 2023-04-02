import { browser, ElementFinder } from 'protractor';
import { BaseComponent } from '../components/base-component.po';
import { setDefaultTimeOut, setShortTimeOut } from '../helpers/pagehelper';

export abstract class BasePage extends BaseComponent {
    abstract pageUrl: string;
    abstract pageVerifyingElement: ElementFinder;
    abstract waitForLoading();

    async verfiedPageDisplayed() {
        await this.assertElementDisplayed(this.pageVerifyingElement);
    }

    async doesPageDisplayed() {
        return this.pageVerifyingElement.isDisplayed();
    }
    async navigate() {
        let token = 10;
        while (token >= 0) {
            token--;
            try {
                await browser.get(browser.baseUrl + this.pageUrl);

                token = -1;
                return await this.waitForLoading();
            } catch (err) {
                await browser.driver.sleep(2000);
                await browser.driver.navigate().refresh();
            }
        }
    }

    async scrollTo(item: ElementFinder) {
        return await browser.executeScript('arguments[0].scrollIntoView()', item.getWebElement());
    }

    async scrollToBottom(item: ElementFinder) {
        return await browser.executeScript('arguments[0].scrollIntoView(false)', item.getWebElement());
    }

    public async switchToPageContainsElement(identifiedElement: ElementFinder) {
        let numberOfTries = 5;
        await setShortTimeOut();
        while (numberOfTries >= 0) {
            let isFound = await identifiedElement.isPresent();
            if (!isFound) {
                let windows = await browser.getAllWindowHandles();
                let windowsNumber = windows.length - 1;
                while (windowsNumber >= 0) {
                    await browser.driver.switchTo().window(windows[windowsNumber]);
                    isFound = await identifiedElement.isPresent();
                    if (!isFound) {
                        windowsNumber--;
                    } else {
                        break;
                    }
                }
                numberOfTries--;
            } else {
                break;
            }
        }
        await setDefaultTimeOut();
    }

    async sleepDebug() {
        return await browser.sleep(500000);
    }

    async shortWait() {
        return await browser.sleep(this.shortTimeout);
    }

    async refreshPage() {
        await browser.refresh();
    }
}
