import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class LTest {

    private WebDriver driver;

    @BeforeClass
    public void setUp() {

        driver = new ChromeDriver();
        driver.get("http://localhost:3000/");
    }

    @Test
    public void testLoginPageTitle() {
        String expectedTitle = "Happy";
        String actualTitle = driver.findElement(By.tagName("h1")).getText();

        Assert.assertEquals(actualTitle, expectedTitle);
    }

    @Test
    public void testLoginFormElements() {
        WebElement cardIdField = driver.findElement(By.id("card_id"));
        WebElement passwordField = driver.findElement(By.id("password"));
        WebElement forgotPasswordLink = driver.findElement(By.xpath("//a[@href='/forgotpassword']"));
        WebElement loginButton = driver.findElement(By.xpath("//button[@type='submit']"));

        Assert.assertTrue(cardIdField.isDisplayed());
        Assert.assertTrue(passwordField.isDisplayed());
        Assert.assertTrue(forgotPasswordLink.isDisplayed());
        Assert.assertTrue(loginButton.isDisplayed());
    }

    @AfterClass
    public void tearDown() {
        driver.quit();
    }
}
