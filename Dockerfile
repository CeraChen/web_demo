FROM node:14-alpine
COPY ./ ./gavis_frontend
CMD npm start