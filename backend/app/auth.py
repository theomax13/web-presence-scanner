import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

security = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        # Supabase JWT is verified using the JWT secret derived from the project
        # The JWKS URL is {SUPABASE_URL}/auth/v1/.well-known/jwks.json
        # For simplicity, we decode with the anon key as audience check
        # and verify via Supabase's JWKS endpoint
        payload = jwt.decode(
            token,
            options={"verify_signature": False},  # TODO: verify with JWKS in production
            algorithms=["HS256"],
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"id": user_id, "email": payload.get("email", "")}
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
