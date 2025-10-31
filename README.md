# Run app
```
dos2unix docker_spr311_native.sh
chmod +x docker_spr311_native.sh
./docker_spr311_native.sh
```

##nginx options /etc/nginx/sites-available/default
```
server {
    server_name   spr311.itstep.click *.spr311.itstep.click;
    client_max_body_size 200M;
    location / {
       proxy_pass         http://localhost:4378;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }

}
```

##nginx restart
```
systemctl status nginx
systemctl restart nginx
certbot
```