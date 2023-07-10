import { prisma } from '@/lib/db';

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prisma.order.findMany({
    where: {
      storeId,
      isPaid: false, //! 원래는 webhook을 통해 결제가 완료되면 true로 변경해줘야함
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: { [key: number]: number } = {};

  // Grouping the orders by month and summing the revenue
  for (const order of paidOrders) {
    const month = order.createdAt.getMonth(); // 0 for January, 1 for February, etc.
    let revenueForOrder = 0;

    for (const item of order.orderItems) {
      revenueForOrder += item.product.price;
    }

    // Adding the revenue for this order to the respective month
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForOrder;
  }

  // Converting the grouped data into the format expected by the graph
  const graphData: GraphData[] = [
    { name: '1월', total: 0 },
    { name: '2월', total: 0 },
    { name: '3월', total: 0 },
    { name: '4월', total: 0 },
    { name: '5월', total: 0 },
    { name: '6월', total: 0 },
    { name: '7월', total: 0 },
    { name: '8월', total: 0 },
    { name: '9월', total: 0 },
    { name: '10월', total: 0 },
    { name: '11월', total: 0 },
    { name: '12월', total: 0 },
  ];

  // Filling in the revenue data
  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[month];
  }

  return graphData;
};
