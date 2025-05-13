import { UserProps } from '../model/types';
import Avatar from '../ui/Avatar/Avatar';
import styles from './User.module.scss';
import UserAvatar from '@assets/userAvatar.svg';

export default function User({ user, variant, createdAt, style }: UserProps) {
  return (
    <div className={styles.userBadge} style={style}>
      <span className={styles.username}>{user?.username || ''}</span>
      <Avatar imgSrc={user?.image || UserAvatar} />
      {variant === 'author' && (
        <time className={styles.articleCreationDate}>
          {createdAt?.split('T')[0] || 'No date'}
        </time>
      )}
    </div>
  );
}
