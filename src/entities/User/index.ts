import User from './ui/User';
import { setCurrentUser, logoutUser } from './model/userSlice';
import {
  selectCurrentUser,
  selectIsAuth,
  selectUserToken,
} from './model/selectors';
import type { CurrentUser, User as UserType } from './model/types';

export {
  User,
  setCurrentUser,
  logoutUser,
  selectCurrentUser,
  selectIsAuth,
  selectUserToken,
  // Types
  CurrentUser,
  UserType,
};

export default User;
