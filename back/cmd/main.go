package main

import "github.com/Dikonskiy/happy-university/back/internal/app"

func main() {
	app := app.NewApp()

	app.StartServer()
}
