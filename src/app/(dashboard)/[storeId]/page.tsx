import React from 'react';

interface Props {
  params: {
    storeId: string;
  };
}

export default function DashboardPage({ params: { storeId } }: Props) {
  return <div>DashboardPage : {storeId}</div>;
}
