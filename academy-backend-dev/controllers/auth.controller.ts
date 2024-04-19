import {getTokensFromCode, getUserFromToken} from '@utils/helpers';
import userService from '../services/user/user.service';
import config from 'config';
import {badRequest, forbiddenRequest} from '@utils/error';
import {Tokens, GoogleErrorResponse} from 'interfaces/user/auth-tokens.interface';

const origin = config.get<string>('server.origin');
const CLIENT_ID = config.get<string>('google.clientId');
const CLIENT_SECRET = config.get<string>('google.clientSecret');

/**
 * @api {post} /api/auth/:code Find or Create User
 * @apiName FindOrCreateUser
 * @apiGroup Authentication
 *
 * @apiDescription This endpoint is responsible for finding or creating a user based on the provided authorization code.
 *
 * @apiParam {String} code Authorization code obtained from the OAuth2 provider.
 *
 * @apiSuccess {Object} user User information.
 * @apiSuccess {Object} auth Token information.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "fistName": string;
 *         "lastName": string;
 *         "email": string;
 *       },
 *       "auth": {
 *         "access_token": string;
 *         "refresh_token": string;
 *       }
 *     }
 *
 * @apiError {String} message Error message.
 * @apiError {String} errorCode Error code for reference.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Authorization code was not provided.",
 *       "status": "auth_failed"
 *       "http_code": 400
 *     }
 *
 *  * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": "Can`t get tokens.",
 *       "status": "get_tokens_failed"
 *       "http_code": 403
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error",
 *     }
 */

async function findOrCreateUser(req, res, next) {
  try {
    if (!req.body.code) {
      throw badRequest('Authorization code was not provided.', 'auth_failed');
    }

    const tokens = await getTokensFromCode(req.body.code);
    const userInfo = await getUserFromToken(tokens.id_token);

    let user = await userService.findUserByEmail(userInfo.email);

    if (!user && userInfo.email.endsWith('@techmagic.co')) {
      user = await userService.createUser(userInfo);
    } else if (!user) {
      throw forbiddenRequest('Invalid email address.', 'auth_failed');
    }

    res.cookie('access_token', tokens.access_token, {httpOnly: true});
    res.cookie('refresh_token', tokens.refresh_token, {httpOnly: true});
    res.json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * @api {post} /api/refreshtoken Get New Tokens
 * @apiName GetNewTokens
 * @apiGroup Authentication
 *
 * @apiDescription This endpoint is responsible for obtaining new access tokens using a refresh token.
 *
 * @apiSuccess {String} message Success message indicating new tokens were obtained.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "New tokens obtained successfully"
 *     }
 *
 * @apiError {String} message Error message.
 * @apiError {String} errorCode Error code for reference.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "http_code": 403
 *       "error": "Refresh token was expired.",
 *       "status": "get_new_token_failed"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "http_code": 403
 *       "error": "Can't get access token",
 *       "status": "get_new_token_failed"
 *     }
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error",
 *     }
 */
async function getNewTokens(req, res, next) {
  try {
    if (!req.cookies.refresh_token) {
      throw forbiddenRequest('Refresh token was expired.', 'get_new_token_failed');
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: origin,
        refresh_token: req.cookies.refresh_token
      })
    });

    if (!response.ok) {
      const errorData: GoogleErrorResponse = (await response.json()) as GoogleErrorResponse;
      throw badRequest(`${errorData.error_description}: ${errorData.error}`, 'get_tokens_failed');
    }

    const tokens: Tokens = (await response.json()) as Tokens;
    res.cookie('access_token', tokens.access_token, {httpOnly: true});

    res.json({message: 'New tokens obtained successfully'});
  } catch (e) {
    next(e);
  }
}

/**
 * @api {post} /api/logout Logout
 * @apiName LogoutUser
 * @apiGroup Authentication
 *
 * @apiDescription This endpoint is responsible for logging out the user by clearing the access and refresh tokens stored in cookies.
 *
 * @apiSuccess {String} message Logout successful message.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Logout successful"
 *     }
 *
 * @apiError {String} message Error message.
 * @apiError {String} errorCode Error code for reference.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Internal Server Error",
 *       "errorCode": "internal_server_error"
 *     }
 */
function logout(req, res, next) {
  try {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    res.json({message: 'Logout successful'});
  } catch (e) {
    next(e);
  }
}

export {findOrCreateUser, getNewTokens, logout};
