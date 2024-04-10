import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class HTest {

    private WebDriver driver;

    @BeforeClass
    public void setUp() {

        driver = new ChromeDriver();
        // Открытие страницы Happy University
        driver.get("http://localhost:3000/");
    }

    @Test
    public void testStudentInfoDisplayedCorrectly() {
        // Проверка отображения информации о студенте
        WebElement nameElement = driver.findElement(By.xpath("//div[@class='td-info' and contains(text(), 'Name Surname:')]"));
        WebElement idElement = driver.findElement(By.xpath("//div[@class='td-info' and contains(text(), 'ID:')]"));
        WebElement emailElement = driver.findElement(By.xpath("//div[@class='td-info' and contains(text(), 'Email:')]"));

        Assert.assertTrue(nameElement.isDisplayed());
        Assert.assertTrue(idElement.isDisplayed());
        Assert.assertTrue(emailElement.isDisplayed());
    }

    @Test
    public void testAttendanceTableDisplayedCorrectly() {
        // Проверка отображения таблицы посещаемости
        WebElement attendanceTable = driver.findElement(By.className("course-table"));

        Assert.assertTrue(attendanceTable.isDisplayed());
    }

    @AfterClass
    public void tearDown() {
        // Закрытие браузера после выполнения всех тестов
        driver.quit();
    }
}
