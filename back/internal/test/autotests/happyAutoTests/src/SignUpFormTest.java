import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class SignUpFormTest extends MainSuperTest {
    @BeforeClass
    public void setup() throws InterruptedException {
        driver.get("http://localhost:3000/");
    }

    @Test
    public void testPageTitle() {
        String expectedTitle = "Happy";
        String actualTitle = driver.findElement(By.tagName("h1")).getText();

        Assert.assertEquals(actualTitle, expectedTitle);

    }

    @Test
    public void signUpVisibilityTest(){
        WebElement uniqueElement = driver.findElement(By.xpath("//a[text()='Forgot password?']"));
        String compareToUnique = "Forgot password?";

        Assert.assertEquals(uniqueElement.getText(), compareToUnique);

    }

    @Test
    public void signUpFillFormTest(){
        WebElement cardIdFillIn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='card_id']")));
        WebElement passwordFillIn = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@id='password']")));
        WebElement logInButton = driver.findElement(By.xpath("//button[text()='Log in']"));


        String card_id = compare.getStudentIdCard();

        cardIdFillIn.sendKeys(card_id);
        passwordFillIn.sendKeys(password);
        logInButton.click();

        WebElement uniqueElement = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[text()='Sign Out']")));

        Assert.assertTrue(uniqueElement.isDisplayed());
    }

    @AfterClass
    public void tearDown(){
        driver.quit();
    }
}
