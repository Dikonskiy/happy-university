import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class RegistrationFormTest extends MainSuperTest{
    @BeforeClass
    public void setup() throws InterruptedException {
        driver.get("http://localhost:3000/");
    }

    @Test
    public void testPageTitle() {
        String expectedTitle = "Account Created\n" +
                "Successfully";
        String actualTitle = driver.findElement(By.tagName("h1")).getText();

        Assert.assertEquals(actualTitle, expectedTitle);
    }


    @Test
    public void registerFillFormTest(){

        int beforeEntry = compare.getPrimaryId();

        WebElement regButton = driver.findElement(By.xpath("//button[@class=\"inactive\"]"));
        regButton.click();

        WebElement emailFill = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='email']")));
        WebElement fullNameFill = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='fullName']")));
        WebElement roleDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//select[@id='role']")));
        WebElement passwordFill = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='password']")));
        Select drop = new Select(roleDropdown);
        WebElement checkbox = driver.findElement(By.xpath("//input[@id=\"terms-and-privacy-policy\"]"));

        WebElement pin = driver.findElement(By.xpath("//input[@placeholder='Enter 4-digit PIN']"));
        pin.sendKeys("1111");

        WebElement submitButton = driver.findElement(By.xpath("//button[text()='Commit']"));

        emailFill.sendKeys("iamaidosj1j1@example.com");
        fullNameFill.sendKeys("Abdibek Aidos");
        drop.selectByVisibleText("Student");
        passwordFill.sendKeys(password);
        checkbox.click();
        submitButton.click();

        sleepwait();

        int afterEntry = compare.getPrimaryId();

        Assert.assertNotEquals(beforeEntry, afterEntry);

        Assert.assertEquals(compare.email, "iamaidosj1j1@example.com");

        Assert.assertEquals(compare.name, "Abdibek Aidos");

    }

    @AfterClass
    public void tearDown(){
        driver.quit();
    }
}
