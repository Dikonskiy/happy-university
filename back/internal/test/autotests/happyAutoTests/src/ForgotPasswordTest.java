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
        WebElement link = driver.findElement(By.xpath("//a[text()='Forgot password?']"));
        link.click();

        WebElement uniqueButtonElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()=\"Send code\"]")));
        WebElement email = driver.findElement(By.xpath("//input[@id='email']"));

        email.sendKeys(compare.getEmail());
        uniqueButtonElement.click();

        Assert.assertTrue(uniqueButtonElement.isEnabled());
    }

    @AfterClass
    public void tearDown(){
        driver.quit();
    }
}
