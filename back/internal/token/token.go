package token

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	CardId string `json:"email"`
	Role   string `json:"role"`
	jwt.StandardClaims
}

func GenerateTokens(cardId, role string) (accessToken string, refreshToken string, err error) {
	accessToken, err = generateToken(cardId, role, time.Minute*1)
	if err != nil {
		return "", "", err
	}

	refreshToken, err = generateToken(cardId, role, time.Hour*24*7)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func generateToken(cardId, role string, expiration time.Duration) (string, error) {
	claims := CustomClaims{
		CardId: cardId,
		Role:   role,
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
