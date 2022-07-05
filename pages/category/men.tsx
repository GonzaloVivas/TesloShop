import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';

const MenPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products?gender=men');

  return (
    <ShopLayout title={'Teslo Shop - Hombres'} pageDescription={'Encuentra los mejores productos de Teslo para hombres'}>

      <Typography variant='h1' component='h1'>Hombres</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={products} />
      }

    </ShopLayout>
  )
}

export default MenPage;
