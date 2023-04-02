import { expect } from 'chai';
import { browser, by, By, element, ElementArrayFinder, ElementFinder, ExpectedConditions, protractor } from 'protractor';
import { DEFAULT_TIMEOUT, LONG_TIMEOUT, NULL_STRING, SHORT_TIMEOUT, waitForClickable } from '../helpers/pagehelper';

export abstract class BaseComponent {
    modalTitle = title => element(by.cssContainingText('.modal-title', title));

    notificationDialog = text => element(by.cssContainingText('.notification-message', text));

    toasterMessage = text => element(by.cssContainingText('.toaster-message', text));


    defaultTimeout = DEFAULT_TIMEOUT;
    shortTimeout = SHORT_TIMEOUT;
    longTimeout = LONG_TIMEOUT;
    nullString = NULL_STRING;
    ////////////// Native function from Selenium Rewritten//////////////

    async nativeClick(element: ElementFinder) {
        try {
            await browser.wait(ExpectedConditions.elementToBeClickable(element), this.defaultTimeout);
            await element.click();
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            return await browser.findElement(element.locator()).click();
        }
    }

    async nativeClearText(element: ElementFinder) {
        try {
            await browser.wait(ExpectedConditions.elementToBeClickable(element), this.defaultTimeout);
            return await element.clear();
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            await browser.findElement(element.locator()).clear();
        }
    }
    async nativeSendKeys(element: ElementFinder, text: string) {
        try {
            await browser.wait(ExpectedConditions.elementToBeClickable(element), this.defaultTimeout);
            await element.sendKeys(text);
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            return await browser.findElement(element.locator()).sendKeys(text);
        }
    }

    //////////////////////////

    async scrollToView(elem: ElementFinder) {
        try {
            await browser.wait(ExpectedConditions.presenceOf(elem), this.defaultTimeout);
            await browser.executeScript("arguments[0].scrollIntoView()", elem.getWebElement());
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            let element = browser.findElement(elem.locator());
            return await browser.executeScript("arguments[0].scrollIntoView()", element);
        }
    }
    async jsSetValue(elem: ElementFinder, text: string) {
        try {
            await browser.wait(ExpectedConditions.presenceOf(elem), this.defaultTimeout);
            await browser.executeScript("arguments[0].innerHTML = '" + text + "'", elem.getWebElement());
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            let element = browser.findElement(elem.locator());
            return await browser.executeScript("arguments[0].innerHTML = '<h1>" + text + "</h1>'", element);
        }
    }
    async jsClick(elem: ElementFinder) {
        try {
            await browser.wait(ExpectedConditions.presenceOf(elem), this.defaultTimeout);
            await browser.wait(ExpectedConditions.visibilityOf(elem), this.defaultTimeout);
            await browser.executeScript("arguments[0].click()", elem);
            console.log("Click-------------------------");
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            let element = browser.findElement(elem.locator());
            return await browser.executeScript("arguments[0].click()", element);
        }
    }
    async selectComboBox(combobox: ElementFinder, option: string) {
        await this.nativeClick(combobox);
        var optionElement = element(By.cssContainingText('option', option));
        await this.nativeClick(optionElement);
    }
    async hitEnter(elem: ElementFinder) {
        return await this.nativeSendKeys(elem, protractor.Key.ENTER);
    }

    async closePopup(popup: ElementFinder) {
        return await this.nativeClick(popup.$('.close'));
    }

    async hoverUnderElem(elem: ElementFinder) {
        try {
            await browser.wait(ExpectedConditions.presenceOf(elem));
            await browser.wait(ExpectedConditions.visibilityOf(elem));
            await browser.actions().mouseMove(elem).perform();
        }
        catch (e) {
            await browser.sleep(this.shortTimeout); //handle StaleObjectElement
            let element = browser.findElement(elem.locator());
            return await browser.actions().mouseMove(element).perform();
        }

    }

    async mouseMoveAndWaitVisibility(elementToMove: ElementFinder, shouldBeVisible: ElementFinder) {
        await this.hoverUnderElem(elementToMove);
        return await browser.wait(ExpectedConditions.visibilityOf(shouldBeVisible), 20000, shouldBeVisible.locator() + ' is not visible');
    }

    async sendQuery(field: ElementFinder, query: string) {
        await this.nativeClearText(field);
        return await this.nativeSendKeys(field, query);
    }



    getDropdownMenu(container: ElementFinder): ElementFinder {
        return container.$('.dropdown-menu');
    }

    getDropdownMenuItems(container: ElementFinder): ElementArrayFinder {
        return container.$$('.dropdown-menu li');
    }

    async assertLengthGreaterThan(elemArray: ElementArrayFinder, number: any) {
        let res = await elemArray.count();
        return await expect(res).to.be.greaterThan(number);
    }

    async assertElementDisplayed(elementFinder: ElementFinder) {
        if (await elementFinder.isPresent()) {
            return await expect(elementFinder.isDisplayed(), 'Visibility of ' + elementFinder.locator()).to.eventually.equal(true);
        }
        else {
            return expect(elementFinder.isElementPresent(elementFinder), 'Visibility of ' + elementFinder.locator()).to.eventually.equal(true);
        }
       
    }

    async assertElementNotPresent(elementFinder: ElementFinder) {
        await this.waitForElementNotPresent(elementFinder);
        return await expect(elementFinder.isPresent(), 'Presence of ' + elementFinder.locator()).to.eventually.equal(false);
    }

    async assertElementNotDisplayed(elementFinder: ElementFinder) {
        //await this.waitForElementInvisible(elementFinder);
        if (await elementFinder.isPresent()) {
            return expect(elementFinder.isDisplayed(), 'Visibility of ' + elementFinder.locator()).to.eventually.equal(false);
        }
        else {
            
            return expect(elementFinder.isElementPresent(elementFinder), 'Visibility of ' + elementFinder.locator()).to.eventually.equal(false);
        }
    }

    async assertElementIsSelected(elementFinder: ElementFinder) {
        return expect(elementFinder.isSelected()).to.eventually.equal(true);
    }

    async assertElementIsNotSelected(elementFinder: ElementFinder) {
        return expect(elementFinder.isSelected()).to.eventually.equal(false);
    }

    async assertAllElementsIsSelected(elements: ElementArrayFinder) {
        return elements.each(elem => {
            this.assertElementIsSelected(elem);
        });
    }

    async assertAllElementsIsNotSelected(elements: ElementArrayFinder) {
        return elements.each(elem => {
            this.assertElementIsNotSelected(elem);
        });
    }

    async assertElementsPresent(elementArrayFinder: ElementArrayFinder | ElementFinder) {
        await this.waitForElementPresent(elementArrayFinder);
        return expect(elementArrayFinder.isPresent());
    }

    async assertElementClickable(elementFinder: ElementFinder) {
        let result: boolean;
        result = false;
        try {
            await waitForClickable(elementFinder);
            result = true;
        }
        catch (err) {
            result = false;
        }

        finally {
            return expect(result).to.be.true;
        }

    }

    async assertNotificationMessage(message: string) {
        return await this.assertElementsPresent(this.notificationDialog(message));
    }

    async assertToasterMessage(message: string) {
        return await this.assertElementsPresent(this.toasterMessage(message));
    }

    async assertElementTextEquals(elementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);
        return expect(elementFinder.getText()).to.eventually.equal(text);
    }

    async assertElementTextNotEquals(text: string, changedText: string) {
        return expect(text).not.to.equal(changedText);
    }

    async assertElementsLengthEqual(elements: ElementArrayFinder, expectedNumber) {
        return expect(elements.count()).to.eventually.equal(parseInt(expectedNumber));
    }

    async assertElementTextContains(elementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);
        return expect(elementFinder.getText()).to.eventually.contain(text);
    }

    async assertElementTextContainsWithoutWait(elementFinder: ElementFinder, text: string) {
        return expect(elementFinder.getText()).to.eventually.contain(text);
    }

    async assertTextsNotEqualsEachOther(firstText: string, secondText: string) {
        return expect(firstText).not.to.equal(secondText);
    }

    async assertTextsEqualsEachOther(firstText: string, secondText: string) {
        return expect(firstText).to.equal(secondText);
    }

    async assertTextNotContainsEachOther(firstText: string, secondText: string) {
        return await expect(firstText).not.to.contain(secondText);
    }

    async assertTextContainsEachOther(firstText: string, secondText: string) {
        return await expect(firstText).to.contain(secondText);
    }

    async assertElementTextNotContains(elementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);

        return expect(elementFinder.getText()).not.to.eventually.contain(text);
    }

    async assertElementArrayTextContains(elements: ElementArrayFinder, text: string) {
        await this.waitForPresenceOfElement(elements.get(0));
        const elementText = elements.reduce((acc, elem) => elem.getText().then((val: string) => acc + val + ' '), '');

        return expect(elementText).to.eventually.contain(text);
    }

    async assertElementArrayTextNotContains(elements: ElementArrayFinder, text: string) {
        await this.waitForElementPresent(elements);
        const elementText = elements.reduce((acc, elem) => elem.getText().then((val: string) => acc + val + ' '), '');

        return expect(elementText).to.eventually.not.contain(text);
    }

    async assertCurrentUrlContains(text: string) {
        return expect(browser.getCurrentUrl()).to.eventually.contain(text);
    }

    async assertCurrentUrlIsNotContain(text: string) {
        return expect(browser.getCurrentUrl()).not.to.eventually.contain(text);
    }

    async assertCurrentUrlEnds(text: string) {
        let url = await browser.getCurrentUrl();
        return expect(url.endsWith(text)).to.equal(true);

    }

    async assertUrlContain(partOfUrl: string) {
        let url = await browser.getCurrentUrl();
        return expect(url).to.contain(partOfUrl);
    }

    async assertElementValueContain(elementFinder: ElementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);
        return expect(elementFinder.getAttribute('value')).to.eventually.contain(text);
    }

    async assertPageSourceContain(text: string) {
        let source = await browser.getPageSource();
        return expect(source).to.contain(text);
    }

    async assertElementValueEqual(elementFinder: ElementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);

        return await expect(elementFinder.getAttribute('value')).to.eventually.equal(text);
    }

    async assertElementAttrEqual(elementFinder: ElementFinder, attr: string, text: string) {
        await this.waitForElementPresent(elementFinder);

        return expect(elementFinder.getAttribute(attr)).to.eventually.equal(text);
    }

    async assertElementValueNotEqual(elementFinder, text: string) {
        await this.waitForElementPresent(elementFinder);

        return expect(elementFinder.getAttribute('value')).not.to.eventually.equal(text);
    }

    async assertElementAttributeNotDisabled(elementFinder: ElementFinder, attribute: string, attrValue: string) {
        await this.waitForElementPresent(elementFinder);
        let attributeData = await elementFinder.getAttribute(attribute);
        return expect(attributeData).not.to.equal(attrValue);

    }

    async assertElementAttributeIsPresent(elementFinder: ElementFinder, attribute: string) {
        await this.waitForElementPresent(elementFinder);
        await elementFinder.getAttribute(attribute);
        return expect(attribute).not.to.be.true;
    }

    async waitForElementPresent(elementFinder: ElementFinder | ElementArrayFinder, timeout = this.defaultTimeout) {
        return await browser.wait(() => elementFinder.isPresent(), timeout).catch(err => false);
    }

    async waitForElementNotPresent(elementFinder: ElementFinder | ElementArrayFinder, timeout = this.defaultTimeout) {
        return await browser.wait(async () => !(await elementFinder.isPresent()), timeout).catch(err => false);
    }

    async waitForElementVisible(el: ElementFinder, timeout = this.defaultTimeout) {
        return await browser.wait(ExpectedConditions.visibilityOf(el), timeout);
    }

    async waitForElementInvisible(el: ElementFinder, timeout = this.defaultTimeout) {
        return await browser.wait(ExpectedConditions.invisibilityOf(el), timeout);
    }

    async waitForElementClickable(el: ElementFinder, timeout = this.defaultTimeout) {
        return await browser.wait(ExpectedConditions.elementToBeClickable(el), timeout);
    }

    async waitForUrlContains(partOfUrl: string, timeout = this.defaultTimeout) {
        return await browser.wait(ExpectedConditions.urlContains(partOfUrl), timeout);
    }

    async waitForPresenceOfElement(el: ElementFinder, timeout = this.defaultTimeout) {
        return await browser.wait(ExpectedConditions.presenceOf(el), timeout);
    }

    async assertElementArrayTextEquals(elements: ElementArrayFinder, subArray: string[]) {
        let array: string[] = [];
        await elements.map(async elm => {
            const text = await elm.getText();
            return array.push(text.replace('\n', ' '));
        });
        return expect(array).to.eql(subArray);
    }

    async assertElementTextTrimEquals(element: ElementFinder, comparedText: string) {
        await this.waitForElementVisible(element);
        let text: string = await element.getText();
        return expect(text.trim()).to.equal(comparedText.trim());
    }

    async assertElementAttributeNotContain(element: ElementFinder, attribute: string, notContainValue: string) {
        let attributeValue: string = await element.getAttribute(attribute);
        return expect(attributeValue).to.not.include(notContainValue);
    }

    async assertNotPresentOfElement(elementFinder: ElementFinder) {
        return await expect(elementFinder.isPresent(), 'Presence of ' + elementFinder.locator()).to.eventually.equal(false);
    }

    async assertElementIsEnabled(element: ElementFinder) {
        return expect(element.isEnabled()).to.eventually.equal(true);
    }

    async assertElementIsDisabled(element: ElementFinder) {
        return expect(element.isEnabled()).to.eventually.equal(false);
    }

}
