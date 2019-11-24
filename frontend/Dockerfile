FROM nginx

COPY target/classes/public/ /public/
COPY frontend.conf /etc/nginx/conf.d/frontend.conf

CMD ["nginx", "-c", "/etc/nginx/conf.d/frontend.conf", "-g", "daemon off;"]
