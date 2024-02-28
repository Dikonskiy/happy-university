package token

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.StandardClaims
}

func GenerateTokens(email, role string) (accessToken string, refreshToken string, err error) {
	accessToken, err = generateToken(email, role, time.Minute*15)
	if err != nil {
		return "", "", err
	}

	refreshToken, err = generateToken(email, role, time.Hour*24*7)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func generateToken(email, role string, expiration time.Duration) (string, error) {
	claims := CustomClaims{
		Email: email,
		Role:  role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(expiration).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString([]byte("your_secret_key"))
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
