import type { NextPage, GetServerSideProps } from 'next';
import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { FullScreenLoading } from '../../components/ui';
import { useProducts } from '../../hooks';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

  return (
    <ShopLayout title={'Teslo Shop - Búsqueda'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>

      <Typography variant='h1' component='h1'>Búsqueda de productos</Typography>

      {
        foundProducts
          ? <Typography variant='h2' sx={{ marginBottom: 1 }}>Término de búsqueda: {query}</Typography>
          : <>
              <Box display='flex'>
                <Typography variant='h2' sx={{ marginBottom: 1 }}>No se encontraron resultados que coincidan con</Typography>
                <Typography variant='h2' color='secondary' textTransform='capitalize' sx={{ ml: 1 }}>{ query }</Typography>
              </Box>
          </>
      }
      

      <ProductList products={products} />
  
    </ShopLayout>
  )
}

export default SearchPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
  const { query = '' } = params as { query: string };

  if ( query.length === 0) {
    return {
      redirect: {
        destination: '/',
        permanent: true
      }
    }
  }

  let products = await dbProducts.getProductsByTerm( query );
  const foundProducts = products.length > 0;
    
  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    }
  }
}
