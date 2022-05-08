# Base builder to get node_modules
FROM node:16.13 AS builder-base
WORKDIR /usr/src/stockviva
ADD ../package.json .
ADD ../yarn.lock .
# Yarn the packages
RUN yarn

# Builder Image
FROM builder-base AS builder
# Setup working directory
WORKDIR /usr/src/stockviva

# Config ENV file
ADD ../.env.production .
RUN  mv .env.production .env

COPY ../ /usr/src/stockviva
# Determine the build environment
RUN yarn build

# Runner Image
FROM builder-base AS runner
# Setup working directory
WORKDIR /usr/src/stockviva

# Export the port
EXPOSE 8899
COPY --from=builder /usr/src/stockviva/node_modules /usr/src/stockviva/node_modules
COPY --from=builder /usr/src/stockviva/dist /usr/src/stockviva/dist
COPY --from=builder /usr/src/stockviva/.env /usr/src/stockviva
# Clean the packages cache
RUN yarn cache clean
# Wait for the db and start the server for development
ENTRYPOINT node dist/main.bundle.js