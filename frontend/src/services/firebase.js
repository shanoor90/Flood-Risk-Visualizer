// This file re-exports the initialized firebase instances
// so they can be imported from '../services/firebase' used in other components.

import { db, database } from '../../firebaseConfig';

export { db, database };

export const mockData = {
   risk: "High",
   waterLevel: "12ft"
};
