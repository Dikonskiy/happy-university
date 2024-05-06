import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.Random;

public class HomePageTest extends MainSuperTest{
    String[] rooms = {"A1","B1","C1","D1","A2","B2","C2","D2","F101","F102","F103"};
    Random random = new Random();
    int randomIndex = random.nextInt(rooms.length);


    @BeforeClass
    public void setup() throws InterruptedException {
        driver.get("http://localhost:3000/");
    }

    @Test
    public void generalActionTest(){
        WebElement cardIdFillIn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='card_id']")));
        WebElement passwordFillIn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='password']")));
        WebElement logInButton = driver.findElement(By.xpath("//button[text()='Log in']"));

        cardIdFillIn.sendKeys(compare.getStudentIdCard());
        passwordFillIn.sendKeys(password);
        logInButton.click();

        sleepwait();

        WebElement electronicAttendance = driver.findElement(By.xpath("//button[text()='Electronic Attendance']"));
        WebElement autoCheck = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Autocheck']")));
        autoCheck.click();

        WebElement home = driver.findElement(By.xpath("//button[text()='Home']"));

        electronicAttendance.click();

        WebElement termDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//select[@class='select-term']")));
        Select termDrop = new Select(termDropdown);

        WebElement showButton = driver.findElement(By.xpath("//input[@class='show-button']"));
        WebElement term = driver.findElement(By.xpath("//label[@class='gray-label']"));

        termDrop.selectByVisibleText("1st term");
        showButton.click();
        Assert.assertTrue(term.isDisplayed());

        sleepwait();

        autoCheck.click();
        WebElement roomDropdown = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//select[@id='room']")));
        Select roomDrop = new Select(roomDropdown);
        roomDrop.selectByValue(rooms[randomIndex]);

        WebElement join = driver.findElement(By.xpath("//button[text()='Join']"));
        join.click();

        WebElement timer = driver.findElement(By.xpath("//span[@class='time']"));
        sleepwait();

        WebElement out = driver.findElement(By.xpath("//button[text()='Out']"));
        out.click();

        Assert.assertNotEquals("00:00:00", timer.getText());

        WebElement reset = driver.findElement(By.xpath("//button[text()='Reset']"));
        reset.click();
        Assert.assertEquals("00:00:00", timer.getText());

        sleepwait();

        home.click();

        sleepwait();

        WebElement uniqueHomeElement = driver.findElement(By.xpath("//h2[@class='home-h2']"));

        Assert.assertTrue(uniqueHomeElement.isDisplayed());

        WebElement signOutButton = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()='Sign Out']")));
        signOutButton.click();

        WebElement actualTitle = driver.findElement(By.tagName("h1"));
    }

    @AfterClass
    public void tearDown(){
        driver.quit();
    }
}
