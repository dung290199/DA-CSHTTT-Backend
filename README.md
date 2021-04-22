# DA-CSHTTT-Backend
# Run
npm start
# API for registering
http://localhost:5000/api/auth/register

# API for logining
http://localhost:5000/api/auth/login

after logining, the token will give by 'auth-token' in headers

# API for update user
http://localhost:5000/api/user/:id -> get user information => GET method

http://localhost:5000/api/user/:id -> update user information => PUT method

http://localhost:5000/api/user/:id/password -> update user information => PUT method
