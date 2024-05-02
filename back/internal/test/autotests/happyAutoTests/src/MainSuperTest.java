import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class MainSuperTest {
    WebDriver driver = new ChromeDriver();
    DataSqlConnect compare = new DataSqlConnect();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    String password = "123qwe";

    public void sleepwait(){
        try {
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}