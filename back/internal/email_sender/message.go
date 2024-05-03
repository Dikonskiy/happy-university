package emailsender

import (
	"fmt"
	"net/smtp"
)

func Sender(email, cardId string) {
	from := "210107021@stu.sdu.edu.kz"
	password := "40616501611"

	to := []string{
		email,
	}

	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

	message := []byte(cardId)

	auth := smtp.PlainAuth("", from, password, smtpHost)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent Successfully!")
}
