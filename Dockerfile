# Using Node:10 Image Since it contains all
# the necessary build tools required for dependencies with native build (node-gyp, python, gcc, g++, make)

FROM node:10
WORKDIR /app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build
# EXPOSE 3000
CMD ["npm", "run", "start:prod"]