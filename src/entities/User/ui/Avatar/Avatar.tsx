import { useEffect, useState } from 'react';
import Loader from '@shared/ui/Loader/Loader';
import styles from './Avatar.module.scss';
import UserAvatar from '@assets/userAvatar.svg';
import { avatarLoadingTimeout } from '@entities/User/config/config';

export default function Avatar({ imgSrc }: { imgSrc: string }) {
  const [isAvatarLoading, setIsAvatarLoading] = useState(true);
  const [isLoadingErrorOccurred, setIsLoadingErrorOccurred] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAvatarLoading((isLoading_ActualState) => {
        if (!isLoading_ActualState) return false;
        setIsLoadingErrorOccurred(true);
        return false;
      });
    }, avatarLoadingTimeout);

    const img = new Image();
    img.src = imgSrc || '';
    img.onload = () => setIsAvatarLoading(false);
    img.onerror = () => {
      setIsAvatarLoading(false);
      setIsLoadingErrorOccurred(true);
    };
    return () => clearTimeout(timeout);
  }, [imgSrc]);

  return (
    <div className={styles.avatarContainer}>
      {isAvatarLoading && <Loader isSmall />}
      {!isAvatarLoading && (
        <img
          src={isLoadingErrorOccurred ? UserAvatar : imgSrc}
          className={styles.avatar}
          alt="User avatar"
        />
      )}
    </div>
  );
}
