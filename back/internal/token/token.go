package token

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

type CustomClaims struct {
	Type string `json:"type"`
	jwt.StandardClaims
}

// generateToken generates both access and refresh tokens
func GenerateTokens(role string) (accessToken string, refreshToken string, err error) {
	// Generate access token
	accessToken, err = generateToken(role, time.Minute*15)
	if err != nil {
		return "", "", err
	}

	// Generate refresh token
	refreshToken, err = generateToken(role, time.Hour*24*7) // Refresh token expires in 7 days
	if err != nil {
		return "", "", err
	}

	return accessToken, refreshToken, nil
}

// generateToken generates a JWT token with the specified expiration time
func generateToken(role string, expiration time.Duration) (string, error) {
	claims := CustomClaims{
		Type: role,
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
