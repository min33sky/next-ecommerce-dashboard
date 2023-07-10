import { getGraphRevenue } from '@/actions/getGraphRevenue';
import { getSalesCount } from '@/actions/getSalesCount';
import { getStockCount } from '@/actions/getStockCount';
import { getTotalRevenue } from '@/actions/getTotalRevenue';
import Heading from '@/components/Heading';
import Overview from '@/components/Overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatToCurrencyKRW } from '@/lib/utils';
import { auth } from '@clerk/nextjs';
import { CreditCard, Package, Receipt } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  params: {
    storeId: string;
  };
}

export default async function DashboardPage({ params: { storeId } }: Props) {
  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);

  const { userId } = auth();

  if (!userId) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="대시보드"
          description="해당 스토어에 대한 간략한 정보를 보여줍니다."
        />
        <Separator />
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 수익</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatToCurrencyKRW(totalRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">판매량</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">재고품</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>개요</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
