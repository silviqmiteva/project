import React from 'react';
import { Button } from 'antd';

interface ButtonProps {
  title: string;
  onClick: () => void;
}

export default function ButtonComponent({ title, onClick }: ButtonProps) {
  return (
    <div>
      <Button type='primary' onClick={onClick}>
        {title}
      </Button>
    </div>
  );
}
