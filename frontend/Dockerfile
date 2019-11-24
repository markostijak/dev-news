FROM nginx

COPY target/classes/public/ /public/
COPY frontend.conf /etc/nginx/conf.d/frontend.conf

RUN chmod 755 -R /public/assets

CMD ["nginx", "-c", "/etc/nginx/conf.d/frontend.conf", "-g", "daemon off;"]
