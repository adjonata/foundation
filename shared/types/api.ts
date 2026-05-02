/** Erro HTTP simplificado para uso compartilhado entre front e back. */
export type ApiLikeError = {
  statusCode?: number;
  status?: number;
  data?: unknown;
};
