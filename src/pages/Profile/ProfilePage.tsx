// import styles from "./ProfilePage.module.scss";
import { ProfileEditForm } from '@features/Auth/ui/ProfileEditForm/ProfileEditForm';

export const ProfilePage = () => {
  return (
    <div style={{ paddingTop: 59 }}>
      <ProfileEditForm title="Edit Profile" />
    </div>
  );
};

export default ProfilePage;
