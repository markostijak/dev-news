FROM nginx

ADD target/classes/public/* /public/
ADD frontend.conf /etc/nginx/conf.d/frontend.conf

CMD ["nginx", "-g", "daemon off;"]
