FROM node:16 AS builder

RUN mkdir -p /usr/src/app
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#RUN #cd ../../ && ls -la
#COPY package*.json ./

COPY . .

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
RUN npm run build
# Bundle app source

FROM nginx:latest
COPY --from=builder /usr/src/app /usr/share/nginx/html

COPY docker/nginx/conf/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/conf/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
