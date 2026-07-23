import { jwtVerify, SignJWT } from "jose";

interface SessionPayload {
  id: string;
  staffId: string;
  name: string;
  role: string;
  territory?: string | null;
  area?: string | null;
  areaCode?: string | null;
}

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_production";
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}
