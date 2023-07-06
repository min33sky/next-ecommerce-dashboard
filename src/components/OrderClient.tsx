import {
  OrderColumn,
  columns,
} from '@/app/(dashboard)/[storeId]/orders/columns';
import React from 'react';
import Heading from './Heading';
import { Separator } from './ui/separator';
import { DataTable } from './ui/data-table';

interface OrderClientProps {
  data: OrderColumn[];
}

export default function OrderClient({ data }: OrderClientProps) {
  return (
    <>
      <Heading
        title="주문 목록"
        description="주문들을 관리하는 페이지입니다."
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
}
