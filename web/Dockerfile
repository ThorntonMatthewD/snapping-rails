FROM nginx:alpine

RUN rm /etc/nginx/conf.d/*
RUN rm /usr/share/nginx/html/index.html

COPY react-nginx.conf /etc/nginx/conf.d/default.conf
COPY build /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;" ]
