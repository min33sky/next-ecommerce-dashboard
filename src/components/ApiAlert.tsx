'use client';

import { Copy, CopyCheck, Server } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge, BadgeProps } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ApiAlertProps {
  title: string;
  description: string;
  variant: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: '공개',
  admin: '관리자',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

export default function ApiAlert({
  title,
  description,
  variant,
}: ApiAlertProps) {
  const [isClicked, setIsClicked] = useState(false);

  const onCopy = (description: string) => {
    setIsClicked(true);
    navigator.clipboard.writeText(description);
    toast.success('클립보드에 복사되었습니다.');
  };

  const Icon = isClicked ? CopyCheck : Copy;

  return (
    <Alert>
      <Server className="w-4 h-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>

      <AlertDescription className="mt-4 flex items-center justify-between">
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {description}
        </code>
        <Button
          variant={'outline'}
          size={'icon'}
          onClick={() => onCopy(description)}
        >
          <Icon
            className={(cn('w-4 h-4'), isClicked ? 'text-green-500' : '')}
          />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
