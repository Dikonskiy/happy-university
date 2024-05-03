import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DataSqlConnect {

     int primaryKeyId;
     String name;
     String studentIdCard;
     String email;

    public  void sql() {
        String url = "jdbc:mysql://127.0.0.1:3306/happy-university";
        String user = "root";
        String password = "admin";

        String query = "SELECT * FROM students ORDER BY student_id DESC LIMIT 1";

        try (
                Connection connection = DriverManager.getConnection(url, user, password);
                Statement statement = connection.createStatement();
                ResultSet resultSet = statement.executeQuery(query)
        ) {
            while (resultSet.next()) {
                primaryKeyId = resultSet.getInt("student_id");
                name = resultSet.getString("student_name");
                studentIdCard = resultSet.getString("student_id_card");
                email = resultSet.getString("email");
                System.out.println( primaryKeyId + name + studentIdCard + email);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public int getPrimaryId(){
        sql();
        return primaryKeyId;
    }

    public String getName(){
        sql();
        return name;
    }

    public String getStudentIdCard(){
        sql();
        return studentIdCard;
    }

    public String getEmail(){
        sql();
        return email;
    }
}
