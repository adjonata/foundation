import { authService } from "../../services/auth.service";
import { getRefreshTokenFromCookie, setAuthCookies } from "../../utils/cookies";
import { AppError, toHttpError } from "../../utils/errors";
import { ok } from "../../utils/response";

export default defineEventHandler(async (event) => {
  try {
    const refreshToken = getRefreshTokenFromCookie(event);
    if (!refreshToken) {
      throw new AppError(
        "MISSING_REFRESH_TOKEN",
        "Refresh token nao informado",
        401,
      );
    }

    const result = await authService.refresh(refreshToken);
    setAuthCookies(event, result.accessToken, result.refreshToken);

    return ok(result.user);
  } catch (error) {
    throw toHttpError(error);
  }
});
