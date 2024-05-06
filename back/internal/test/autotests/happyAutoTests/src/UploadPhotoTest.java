import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.io.File;

public class UploadPhotoTest extends MainSuperTest{

    @BeforeClass
    public void setup() throws InterruptedException {
        driver.get("http://localhost:3000/");
    }


    @Test
    public void upload(){
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


        WebElement uploadInput = driver.findElement(By.xpath("//input[@type='file']"));
        uploadInput.sendKeys(new File("C:\\Users\\Georgiy\\Desktop\\soft eng\\happy-university\\back\\internal\\test\\autotests\\happyAutoTests\\src\\cactus.png").getAbsolutePath());
        WebElement birth = driver.findElement(By.xpath("//input[@class='custom']"));
        birth.sendKeys("12-12-2003");
        WebElement sendCode = driver.findElement(By.xpath("//button[@type='submit']"));
        sendCode.click();

        WebElement unique = driver.findElement(By.xpath("//h1[text()='Happy']"));
        sleepwait();
        Assert.assertTrue(unique.isDisplayed());

    }
}
