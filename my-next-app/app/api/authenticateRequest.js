import jwt from 'jsonwebtoken';

export function authenticateRequest(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error("Unauthorized - Missing token");
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  
  try {
    decoded = jwt.verify(token, process.env.AUTH_SECRET);
  } catch (error) {
    throw new Error("Unauthorized - Invalid token");
  }

  const userId = decoded.userId;
  if (!userId) {
    throw new Error("Unauthorized - Invalid token payload");
  }

  return userId;
}
