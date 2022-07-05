import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const WomenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=women');

  return (
    <ShopLayout title={'Teslo Shop - Mujeres'} pageDescription={'Encuentra los mejores productos de Teslo para mujeres'}>

      <Typography variant='h1' component='h1'>Mujeres</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default WomenPage;
