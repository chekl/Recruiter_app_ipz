import {badRequest, forbiddenRequest} from '@utils/error';

async function verifyToken(req, res, next) {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      throw forbiddenRequest('Authorization token is expired.', 'verification_failed');
    }

    const tokenInfo: {error?: string} = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`,
      {method: 'POST'}
    ).then(res => res.json());

    if (tokenInfo.error) {
      throw badRequest('Authorization token is wrong.', 'verification_failed');
    }

    next();
  } catch (err) {
    next(err);
  }
}

export {verifyToken};
