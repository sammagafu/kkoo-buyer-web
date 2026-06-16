/**
 * Buyer web + landing routes — kkooapp.co.tz / www.kkooapp.co.tz
 */
import { urlAliasRoutes } from './url-aliases'
import { authRoutes } from './auth'
import { publicMicrositeRoutes } from './public-microsite'
import { errorRoutes } from './errors'
import { accountRoutes } from './account'
import { pagesRoutes } from './marketing-pages'
import { buyerVerticalRoutes } from './buyer-verticals'

export { setTitle, setLandingTitle, baseBrand } from './meta'

export const allRoutes = [
  ...pagesRoutes,
  ...buyerVerticalRoutes,
  ...urlAliasRoutes,
  ...accountRoutes,
  ...publicMicrositeRoutes,
  ...authRoutes,
  ...errorRoutes,
]
