import React from 'react';
import styles from './Message.module.scss';

type MessageProps = {
  text: string;
  type: 'error' | 'info' | 'warning';
};

const Message: React.FC<MessageProps> = ({ text, type }) => {
  const className = styles.message + ' ' + styles[`${type}`];

  return <div className={className}>{text}</div>;
};

export default Message;
