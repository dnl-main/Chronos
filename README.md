<<<<<<< HEAD
git clone --single-branch --branch 07/05/2025 https://github.com/Ian-nwb/Concorde-Web.git
cd Concorde-Web
cd JWTfrontweb 
npm i
cd ..
cd JWTbackweb
composer i


import concorde.sql in phpmyadmin from JWTdatabase 
------------------------------------------------
change frontend env to local
paste this env

# FOR WEB HOSTING php artisan serve --host=0.0.0.0 --port=8000 AND
#VITE_API_BASE_URL=http://112.203.155.181:8000/api

# FOR LOCAL DEV php artisan serve AND
VITE_API_BASE_URL=http://127.0.0.1:8000/api
------------------------------------------------
change backend env to local
paste this env to respective position
# APP_URL=http://112.203.155.181
APP_URL=http://127.0.0.1
------------------------------------------------
>Composer Link
https://getcomposer.org/download/

>Node Link
https://nodejs.org/en/download

before composer setup
Go to
C:\ProgramFiles\php\8.46\php.ini
remove ;
;extension=fileinfo
------------------------------------------------------------------------------------------------
FOR Ian
RUN THIS AT NGROK 
http 112.203.155.181:8000

Change frontend.env to ngrok url/api
#FOR WEB HOSTING php artisan serve --host=0.0.0.0 --port=8000 AND
# VITE_API_BASE_URL=http://112.203.155.181:8000/api

#FOR LOCAL DEV php artisan serve AND
# VITE_API_BASE_URL=http://127.0.0.1:8000/api

#FOR SECURE WEB HOSTING USE  php artisan serve --host=0.0.0.0 --port=8000 AND NGROK PROVIDED URL
VITE_API_BASE_URL=https://.ngrok-free.app/api

Change cors.php to ngrok url/apI
    'allowed_origins' => [
    'http://112.203.155.181',
    'http://localhost:5173',
    'https://concorde-web.vercel.app',
    'https:INSERT_HERE_ngrok-free.app',
    ],

#BEFORE RUNNING PHP ARTISAN SERVE (NEW CLONE)
php artisan storage:link


#For MySQL
net start mysql93
netstat -an | find "3306"
net stop mysql93
=======
# Chronos
>>>>>>> 0aa0dfef11a2177cebc67219e5da7c752c76c89a
