upstream mothership_pool {
    server 127.0.0.1:8889       fail_timeout=5s max_fails=3s;
    # server 127.0.0.1:8889     weight=5; # reqs are distributed round-robin based on weights (default:1)
    # server 127.0.0.1:8889     backup; # backup servers are only used if all non-backups are unavailable
    # server 127.0.0.1:8889     down;# a down server will never receive a request
}

server {
    listen conf.mothership.com:443 ssl;
    ssl_certificate     /Users/mike/checkout/mothership/ssl/mothership_dev_cert.pem;
    ssl_certificate_key /Users/mike/checkout/mothership/ssl/mothership_dev_key.pem;
    ssl_protocols       SSLv3 TLSv1;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    server_name conf.mothership.com;

    location /favicon.ico {
        alias /Users/mike/checkout/mothership/client/img/favicon.ico;
    }

    location /fe {
        alias /Users/mike/checkout/mothership/client;
        index index.html
        try_files $uri $uri/;
    }

    location / {
        proxy_set_header      X-Real-IP          $remote_addr;
        proxy_set_header      X-Forwarded-For    $proxy_add_x_forwarded_for;
        proxy_set_header      X-Forwarded-Proto  $scheme;
        proxy_set_header      Host               $http_host;

        proxy_pass http://mothership_pool;
        proxy_redirect off;

        proxy_connect_timeout       30; # seconds allowed to establish connection to the backend
        proxy_send_timeout          30; # seconds allowed to send the request to the backend
        proxy_read_timeout          30; # seconds allowed to recieve a response from the backend 

        proxy_buffer_size          8k;
        proxy_buffers              8 32k;
        proxy_busy_buffers_size    64k;

        client_max_body_size        1m;
        client_body_buffer_size     128k;
    }
}
