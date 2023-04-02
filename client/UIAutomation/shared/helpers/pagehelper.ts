import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { browser, by, ElementArrayFinder, ElementFinder, ExpectedConditions, protractor } from 'protractor';

let TIMEOUT = 8000;

export const DEFAULT_TIMEOUT = 8000;
export const SHORT_TIMEOUT = 1000;
export const LONG_TIMEOUT = 200000;
export const NULL_STRING = 'null_string';
export function setTimeOut(milliseconds: number) {
    return TIMEOUT = milliseconds;
}

export function setShortTimeOut() {
    return setTimeOut(SHORT_TIMEOUT);
}

export function setDefaultTimeOut() {
    return setTimeOut(DEFAULT_TIMEOUT);
}

export function setLongTimeOut() {
    return setTimeOut(LONG_TIMEOUT);
}

export async function waitFor(condition: Function, opt_message?: string) {
    return await browser.wait(condition, TIMEOUT, opt_message);
}

export async function waitForClickable(button: ElementFinder) {
    return await waitFor(ExpectedConditions.elementToBeClickable(button), 'Waiting for clickable ' + button.locator());
}

export async function waitForNotClickable(button: ElementFinder) {
    return await waitFor(ExpectedConditions.not(ExpectedConditions.elementToBeClickable(button)), 'Waiting for not clickable ' + button.locator());
}

export async function waitForVisible(elem: ElementFinder) {
    return await waitFor(ExpectedConditions.visibilityOf(elem), 'Waiting for appearing ' + elem.locator());
}

export async function waitForInVisible(elem: ElementFinder) {
    return await waitFor(ExpectedConditions.invisibilityOf(elem), 'Waiting for dissappearing ' + elem.locator());
}

export async function waitForText(element: ElementFinder) {
    let text = await element.getText();
    return await waitFor(() => text.length > 0, 'Waiting for text in ' + element.locator());
}

export async function waitForCount(elementArrayFinder: ElementArrayFinder, opt_count?: number) {
    return await waitFor(() => presenceOfAll(elementArrayFinder, opt_count), 'Waiting for items in ' + elementArrayFinder.locator());
}

export async function waitForZero(elementArrayFinder: ElementArrayFinder, timeout?: number) {
    return await browser.wait(
        presenceOfNone(elementArrayFinder),
        timeout || TIMEOUT,
        'Waiting for zero items in ' + elementArrayFinder.locator());
}

export async function waitForAllPresent(...elements: ElementFinder[]) {
    return protractor.promise.all(elements.map(waitForVisible));
}

export async function presenceOfAll(elementArrayFinder: ElementArrayFinder, opt_count?: number) {
    const wait_count = opt_count || 0;
    let count = await elementArrayFinder.count();
    return await count >= wait_count;
}

export async function presenceOfNone(elementArrayFinder: ElementArrayFinder) {
    let count = await elementArrayFinder.count();
    return count == 0;
}

export async function waitForFileDownloaded(filename: string, timeout?: number) {
    return await browser.wait(() => {
        return fs.existsSync(filename);
    }, timeout || 40000, 'Waiting for downloading file');
}

export async function executeSequence(actionPromises) {
    const flow = browser.controlFlow();

    return protractor.promise.all(
        actionPromises.map(promise => flow.execute(() => promise)));
}

export async function moveMouseAndClick(element: ElementFinder) {
    try {
        await waitForVisible(element);
    }
    catch (err) { }
    finally {
        return await browser.actions().click(element).perform();
    }
}

export async function selectOptionByText(select: ElementFinder, text: string, index: number) {
    const optionElement = await select.all(by.cssContainingText('option', text)).get(index);

    return await optionElement.click();
}

export async function hasClass(element: ElementFinder, cls: string) {
    let classes = await element.getAttribute('class');
    return await classes.split(' ').indexOf(cls) !== -1;
}

export function getByText(elementsArray: ElementArrayFinder, compareText: string, fullComparison = true): ElementFinder {
    return elementsArray.filter(async element => {
        let text = await element.getWebElement().getText();
        return await (fullComparison ? text.trim() === compareText : text.trim().indexOf(compareText) !== -1);
    }).first();
}

export async function getConsoleErrors() {
    let browserLog = await browser.manage().logs().get('browser');
    return await browserLog.filter(element => element.level.value > 900);
}

function getArrayText(elementArray: ElementArrayFinder): string[] {
    let textArray: string[] = [];
    elementArray.each(async element => {
        let text: string = await element.getText();
        textArray.push(text);
    })
    return textArray;
}

export async function navigate() {
    await browser.waitForAngularEnabled(false);

    return await browser.get('chrome://downloads/');
}

export async function waitForFileFinishDownload(downloadedFileName?: string, elementShouldBeInvisible?: ElementFinder) {
    const filename = path.resolve(__dirname, '../../downloads/' + downloadedFileName);
    await elementShouldBeInvisible ? await waitForInVisible(elementShouldBeInvisible) : true;

    return process.env.SAUCE ? await browser.sleep(8000) : await waitForFileDownloaded(filename);
}

export async function assertDownloadsExist(downloadedFileName: string) {
    const fileName = await browser.executeScript(`
  return downloads.Manager.get().items_[0].file_name;`);
    return expect(fileName).to.equal(downloadedFileName);
}

export async function assertDownloadProfileContains(downloadedFileName: string) {
    const fileName = await browser.executeScript(`
  return downloads.Manager.get().items_[0].file_name;`);
    return expect(fileName).to.contains(downloadedFileName)
}

export async function downloadFinished() {
    return await browser.waitForAngularEnabled(true);
}


