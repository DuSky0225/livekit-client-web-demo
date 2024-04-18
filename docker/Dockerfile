FROM docker.hanweb.com/hanwebbase/nginx:v1.25.1
COPY ./dist /usr/share/nginx/html/
EXPOSE 80
ENV TZ=PRC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
