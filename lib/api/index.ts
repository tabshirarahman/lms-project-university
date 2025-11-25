export { handleApiError, ApiError } from "./error-handler"
export type { ApiErrorResponse } from "./error-handler"

export { requireAuth, requireRole, requireAdmin } from "./auth-middleware"

export {
  handleGetById,
  handleUpdate,
  handleDelete,
  createCrudRoute,
  
} from "./crud-handler"
export type { CrudOptions, ListOptions } from "./crud-handler"
