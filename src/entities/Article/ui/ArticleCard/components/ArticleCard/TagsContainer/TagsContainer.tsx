import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './TagsContainer.module.scss';
import { useOverflowCheck } from '@shared/hooks';

const TagsContainer: React.FC<{ tagList: string[] | undefined }> = ({
  tagList,
}) => {
  if (!tagList) return null;

  const [showAllTags, setShowAllTags] = useState(false);
  const { containerRef, isOverflowing } = useOverflowCheck({
    deps: [tagList],
    listenResize: true,
  });

  const tagsJSX = tagList
    ?.map((tag) => {
      if (!tag?.trim()) return;
      return (
        <span className={styles.tag} key={uuidv4()} title={tag}>
          {tag}
        </span>
      );
    })
    .filter(Boolean);

  return (
    <div
      className={`${styles.tagsWrapper} 
        ${isOverflowing ? styles.showMoreTags : ''} 
        ${showAllTags ? styles.expanded : ''}`}
      onClick={() => setShowAllTags(!showAllTags)}
      ref={containerRef}
    >
      <div className={`${styles.tags}`}>
        {tagsJSX?.length > 0 ? tagsJSX : 'No tags'}
      </div>
    </div>
  );
};

export default TagsContainer;
