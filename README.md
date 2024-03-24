# README

## Installation

1. Navigate to the project directory:

```bash
cd happy-university
```

## Configuration

1. Open the `config.json` file and update the configuration parameters as needed(write the correct connection path with mysql).

## Running the Back

Execute the following command to run the application:

```bash
go run .\back\cmd\main.go
```

## Running the Front

Navigate to the front package

```bash
cd front
```

Execute the following command to run the application:

```bash
npm start
```

## Endpoints

/register

```json
{
    "name": "string",
    "email": "string",
    "role": "string",
    "password": "string"   
}
```

/login

```json
{
    "card_id": "string",
    "password": "string"
}
```

/card-entry-in
/card-entry-out

```json
{
    "card_id": "string",
    "course": "string"
}
```

/get-role

```json
{
    "access_token": "string"
}
```