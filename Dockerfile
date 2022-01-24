FROM node:15-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm set unsafe-perm true

# Install app dependencies
RUN npm install

# Bundle app source
COPY . /usr/src/app/

EXPOSE 5000

RUN npx prisma generate

# create databse models
CMD ["npm", "run", "start:migrate"]