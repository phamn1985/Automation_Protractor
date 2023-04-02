import { browser, ElementFinder, protractor, ProtractorExpectedConditions } from 'protractor';

export class AbstractPage {

    public static getEC(): ProtractorExpectedConditions {
        return protractor.ExpectedConditions;
    }

    public static async sendQuery(field: ElementFinder, query: string) {
        await field.clear();
        return await field.sendKeys(query);

    }

    public static async sendQueryWithoutClear(field: ElementFinder, query: string | number) {
        await field.sendKeys(query);
        return await browser.sleep(1000);
    }

}
