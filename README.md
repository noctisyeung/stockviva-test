# Stockviva BE Test
## Endpoints
For now we have 1 endpoint for API testing <br/><br/>
API URL=[https://stockviva-be.herokuapp.com/](https://stockviva-be.herokuapp.com/ "Production Link") <br/>
- (without currency) [/api/crypto](https://stockviva-be.herokuapp.com/api/crypto)
- (with currency) [/api/crypto?currency=JPY](https://stockviva-be.herokuapp.com/api/crypto?currency=JPY)

## How to run

### Run on Local
  You can run the code in local with this project, please follow the below step to run it.

1. Config the environment
   
    ```bash
    # Copy the env file and modify the key and env
    cp .env.template .env
    ```

2. Install package
   ```bash
   yarn
   ```

3. Start the application
   ```bash
   yarn start
   ```
### Run on Docker (Dev)
  You can run the code in docker for local development

1. Config the environment
   
    ```bash
    # Copy the env file and modify the key and env
    cp .env.template .env.development
    ```

2. Build and run the image
   ```bash
   yarn docker:dev
   ```

### Run on Docker (Pro)
  You can run the code in docker for local development

1. Config the environment
   
    ```bash
    # Copy the env file and modify the key and env
    cp .env.template .env.production
    ```

2. Build and run the image
   ```bash
   yarn docker:pro
   ```

## Deployment
We are using Heroku to deploy our Docker file, please follow the below steps to deploy the application

1. Config the environment
   
    ```bash
    # Copy the env file and modify the key and env
    cp .env.template .env.production
    ```
2. Build and run the image
   ```bash
   heroku login
   ```

2. Build and run the image
   ```bash
   heroku container:login
   ```

2. Build and run the image
   ```bash
   yarn deploy
   ```

## How to test
We are using Jest to do our unit test

```bash
# To do the unit test
yarn test
```

```bash
# To do the unit test with coverage
yarn test:coverage
```

## Requirement
1. Node >= 15
2. yarn
3. Docker
4. Heroku
