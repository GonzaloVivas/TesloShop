import { useEffect, useState } from 'react'
import useSWR from 'swr'

import { Grid, Typography } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'

import { SummaryTile } from '../../components/admin'
import { AdminLayout } from '../../components/layouts'
import { DashboardSummaryResponse } from '../../interfaces'

const DashboardPage = () => {

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {

    const interval = setInterval(() => {
      setRefreshIn( val => val > 0 ? val - 1 : 30 );
    }, 1000);

    return () => {
      clearInterval(interval);
    }

  }, [])
  

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000, // 30 seconds
  });

  if ( !error && !data ) {
    return <></>
  }

  if ( error ) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    productsWithLowInventory,
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadísticas generales'
      icon={ <DashboardOutlined /> }
    >
      <Grid container spacing={2}>

        <SummaryTile
          title={ numberOfOrders }
          subTitle='Ordenes totales'
          icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ paidOrders }
          subTitle='Ordenes pagadas'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ notPaidOrders }
          subTitle='Ordenes pagadas'
          icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ numberOfClients }
          subTitle='Clientes'
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ numberOfProducts }
          subTitle='Productos'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ productsWithNoInventory }
          subTitle='Productos sin stock'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ productsWithLowInventory }
          subTitle='Productos con bajo stock'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile
          title={ refreshIn }
          subTitle='Próxima actualización en'
          icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

      </Grid>

    </AdminLayout>
  )
}

export default DashboardPage