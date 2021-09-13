import OktaJwtVerifier from '@okta/jwt-verifier';
import { FastifyRequest, FastifyReply } from 'fastify';

const middlewareVerifier = async (request: FastifyRequest, response: FastifyReply): Promise<void> => {
  const issuer = process.env.OKTA_ISSUER;
  const clientId = process.env.OKTA_CLIENT_ID;
  const audience = process.env.OKTA_AUDIENCE;

  if (!issuer || !clientId || !audience) {
    response.code(401).send({ error: 'invalid env variables' });
    return;
  }

  const { authorization } = request.headers;

  if (!authorization) {
    response.code(401).send({ error: 'authorization header missing' });
    return;
  }

  const [, token] = authorization.trim().split(' ');
  const oktaJwtVerifier = new OktaJwtVerifier({
    issuer,
    clientId,
  });

  try {
    const { claims } = await oktaJwtVerifier.verifyAccessToken(token, audience);

    if (!claims) {
      response.code(401).send({ error: 'claims missing' });
      return;
    }

    if (!claims.scp) {
      response.code(401).send({ error: 'scp missing' });
      return;
    }

    if (claims.scp && !claims.scp.includes('api')) {
      response.code(401).send({ error: 'wrong claim' });
      return;
    }
  } catch (err) {
    response.code(401).send({ error: 'generic error' });
  }
};

export default middlewareVerifier;
