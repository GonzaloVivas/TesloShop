import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const KidsPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=kid');

  return (
    <ShopLayout title={'Teslo Shop - Niños'} pageDescription={'Encuentra los mejores productos de Teslo para niños'}>

      <Typography variant='h1' component='h1'>Niños</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default KidsPage;
