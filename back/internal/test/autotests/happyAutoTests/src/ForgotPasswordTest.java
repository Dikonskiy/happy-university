import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class ForgotPasswordTest extends MainSuperTest{
    @BeforeClass
    public void setup() throws InterruptedException {
        driver.get("http://localhost:3000/");
    }

    @Test
    public void linkTest(){
        WebElement link = driver.findElement(By.xpath("//a[text()=\"Forgot password?\"]"));
        link.click();

        WebElement uniqueButtonElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()=\"Send code\"]")));
        Assert.assertTrue(uniqueButtonElement.isDisplayed());
    }

    @Test
    public void submitTest(){

        WebElement uniqueButtonElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()=\"Send code\"]")));
        WebElement cardid = driver.findElement(By.xpath("//input[@id='card_id']"));
        WebElement pin = driver.findElement(By.xpath("//input[@placeholder='Enter 4-digit PIN']"));
        cardid.sendKeys("17398336");
        sleepwait();
        pin.sendKeys("1111");
        sleepwait();
        uniqueButtonElement.click();

        Assert.assertEquals("1111", "1111");
    }

    @AfterClass
    public void tearDown(){
        driver.quit();
    }
}
