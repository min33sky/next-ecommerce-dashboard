'use client';

import { useModal } from '@/app/hooks/useModal';
import { Store } from '@prisma/client';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Popover, PopoverContent } from './ui/popover';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, PlusCircle, StoreIcon } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[];
}

export default function StoreSwitcher({
  items,
  className,
  ...props
}: StoreSwitcherProps) {
  const storeModal = useModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId,
  );

  const [open, setOpen] = useState(false);

  const onStoreSelect = (store: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <StoreIcon className="mr-2 w-4 h-4" />
          {currentStore?.label || '스토어 이름'}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="스토어 검색하기" />
            <CommandEmpty>찾는 스토어가 없습니다.</CommandEmpty>
            <CommandGroup heading="스토어 목록">
              {formattedItems.map((store) => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 w-4 h-4" />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto w-4 h-4',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>

          <CommandSeparator />

          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storeModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 w-5 h-5" />
                스토어 만들기
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
