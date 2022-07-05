import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from "@mui/material"
import { ItemCounter } from '../ui';
import { CartContext } from '../../context';
import { ICartProduct, IOrderItem } from '../../interfaces';

interface Props {
  editable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ editable = false, products }) => {

  const { cart, removeProductFromCart, updateCartQuantity } = useContext(CartContext);

  const onProductQuantityChange = (product: ICartProduct, newQuantity: number) => {
    product.quantity = newQuantity;
    updateCartQuantity(product);
  }

  const onRemoveProduct = (product: ICartProduct) => {
    removeProductFromCart(product);
  }

  const productsToShow = products ? products : cart;

  return (
    <>
      {
        productsToShow.map( product => (
          <Grid key={ product._id + product.size } container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <NextLink href={`/products/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={ product.image }
                      component='img'
                      sx={{ borderRadius: '5px' }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>

            <Grid item xs={7}>
              <Box display='flex' flexDirection='column'>
              
                <Typography variant='body1'>{ product.title }</Typography>
                <Typography variant='body1'>Talla: <strong>{ product.size }</strong></Typography>

                {
                  editable
                    ? (
                      <ItemCounter
                        quantity={ product.quantity }
                        onQuantityUpdate={( q ) => onProductQuantityChange(product as ICartProduct, q) }
                        maxValue={ 10 }
                      />
                    )
                    : <Typography variant='h6'>{ product.quantity } { product.quantity > 1 ? 'productos' : 'producto' }</Typography>
                }

              </Box>
            </Grid>

            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
              <Typography variant='subtitle1'>${product.price}</Typography>
              {
                editable && (
                  <Button onClick={ () => onRemoveProduct(product as ICartProduct) } variant='text' color='secondary'>Remover</Button>
                )
              }
            </Grid>
          </Grid>
        ))
      }
    </>
  )
}
