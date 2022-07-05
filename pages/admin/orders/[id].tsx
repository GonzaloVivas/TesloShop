import { GetServerSideProps, NextPage } from 'next'
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material"
import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from '../../../components/layouts';
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const { shippingAddress } = order;

  return (
    <AdminLayout
      title={"Resumen de la orden"}
      subTitle={`#${ order._id }`}
      icon={ <AirplaneTicketOutlined /> }
    >

      <Grid container spacing={4} sx={{ mt: 1 }} className='fadeIn'>

        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>

              <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
              <Divider sx={{ my: 1 }} />

              <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
              <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}, {shippingAddress.zip}</Typography>
              <Typography>{shippingAddress.city}</Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary
                orderValues={{
                  numberOfItems: order.numberOfItems,
                  subtotal: order.subtotal,
                  tax: order.tax,
                  total: order.total,
                }}
              />

              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>

                <Box sx={{ display: 'flex', flex: 1 }} flexDirection='column'>
                  {
                    order.isPaid
                      ? (
                        <Chip
                          sx={{ mt: 2 }}
                          label='Orden paga'
                          variant='outlined'
                          color='success'
                          icon={<CreditScoreOutlined />}
                        />
                        
                        )
                        : (
                          
                          <Chip
                            sx={{ mt: 2 }}
                            label='Impago'
                            variant='outlined'
                            color='error'
                            icon={ <CreditCardOffOutlined /> }
                          />
                      )
                    }

                </Box>

              </Box>

            </CardContent>
          </Card>
        </Grid>

      </Grid>

    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {

  const { id = '' } = query;

  const order = await dbOrders.getOrderById(id.toString());
  if (!order) {
    return {
      redirect: {
        destination: '/orders/history',
        permanent: false,
      }
    }
  }

  return {
    props: {
      order
    }
  }
}

export default OrderPage;