FROM nginx

ADD target/classes/public/* /public/
ADD frontend.conf /etc/nginx/conf.d/frontend.conf

CMD ["nginx", "-c", "/etc/nginx/conf.d/frontend.conf", "-g", "daemon off;"]
