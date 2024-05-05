package token

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type TokenType string

const (
	AccessToken  TokenType = "access"
	RefreshToken TokenType = "refresh"
)

type CustomClaims struct {
	CardId string    `json:"card_id"`
	Role   string    `json:"role"`
	Type   TokenType `json:"type"`
	jwt.StandardClaims
}

func GenerateTokens(cardId, role string) (accessToken string, refreshToken string, err error) {
	accessToken, err = GenerateToken(cardId, role, AccessToken, time.Minute*15)
	if err != nil {
		return "", "", err
	}

	refreshToken, err = GenerateToken(cardId, role, RefreshToken, time.Hour*24*7)
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

func GenerateToken(cardId, role string, tokenType TokenType, expiration time.Duration) (string, error) {
	claims := CustomClaims{
		CardId: cardId,
		Role:   role,
		Type:   tokenType,
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
