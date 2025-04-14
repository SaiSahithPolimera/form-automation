import { describe, it } from 'node:test';
import { Builder, By, until } from 'selenium-webdriver';


describe("Test fields", () => {
    it("All fields passed the test", async () => {
        const driver = await new Builder().forBrowser('chrome').build();
        try {
            await driver.get('https://app.cloudqa.io/home/AutomationPracticeForm');
            const fields = [
                { label: 'Name', value: 'Sai Sahith', locator: By.id("fname") },
                { label: 'Email', value: 'sai@example.com', locator: By.id("email") },
                { label: 'Mobile #', value: '0324334343', locator: By.id("mobile") }
            ];
            for (const field of fields) {
                try {
                    const input = await driver.wait(until.elementLocated(field.locator), 5000);
                    await input.clear();
                    await input.sendKeys(field.value);
                    const enteredValue = await input.getAttribute("value");
                    if (enteredValue === field.value) {
                        console.log(`• ${field.label} field passed. `);
                    } else {
                        console.log(`° ${field.label} test failed. Expected: ${field.value}, Got: ${enteredValue}`);
                    }
                } catch (err) {
                    console.log(`Could not test ${field.label}: ${err.message}`);
                }
            }
        } finally {
            await driver.quit();
        }
    }
    );
})
