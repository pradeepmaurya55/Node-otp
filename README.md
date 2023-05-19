# Node-OTP

Login through OTP only

        Deployed on Vercel
        Mail Testing done on Mailtrap.io
        MongoDB Atlas Cluster used

## API

    The following API endpoints are available.

#### Generate OTP

`POST /api/v1/getOTP/`

#### Verify OTP

`POST /api/v1/verifyOTP/`

#### Conditions Implemented

        OTP once used cannot be used again.
        OTP valid for 5 minutes only.
        1 minute gap for another OTP request.
        5 consecutive wrong OTP will restrict the user login for 1 hour.
