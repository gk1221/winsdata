docker run -d -p 5207:80 \
-v $(pwd)/default.conf:/etc/nginx/conf.d/default.conf \
-v $(pwd):/usr/share/nginx/html \
--name my-nginx-container nginx:alpine