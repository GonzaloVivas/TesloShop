import { FC, ReactNode, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { CartContext, cartReducer } from './';
import { tesloApi } from '../../api';
import axios, { AxiosError } from 'axios';


interface Props {
  children: ReactNode
}
export interface CartState {
  isLoaded        : boolean;
  cart            : ICartProduct[];
  numberOfItems   : number;
  subtotal        : number;
  tax             : number;
  total           : number;

  shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: [],
  numberOfItems: 0,
  subtotal: 0,
  tax: 0,
  total: 0,

  shippingAddress: undefined,
}

export const CartProvider: FC<Props> = ({ children }) => {

  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      const cartInCookie = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : [];
      dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: cartInCookie });
    } catch (error) {
      dispatch({ type: '[Cart] - Load Cart from cookies | storage', payload: [] });    
    }
  }, []);

  useEffect(() => {
    if ( Cookie.get('firstName')) {

      const shippingAddress = {
        firstName   : Cookie.get('firstName') || '',
        lastName    : Cookie.get('lastName') || '',
        address     : Cookie.get('address') || '',
        address2    : Cookie.get('address2') || '',
        zip         : Cookie.get('zip') || '',
        city        : Cookie.get('city') || '',
        country     : Cookie.get('country') || '',
        phone       : Cookie.get('phone') || '',
      }
  
      dispatch({ type: '[Cart] - Load Address from Cookies', payload: shippingAddress });    
    }
  }, [])
  

  useEffect(() => {
    if (state.cart.length > 0) {
      Cookie.set('cart', JSON.stringify(state.cart));
    }
  }, [state.cart]);
  
  useEffect(() => {

    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subtotal = state.cart.reduce((prev, current) => current.price * current.quantity + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) || 0;

    const orderSummary = {
      numberOfItems, 
      subtotal,
      tax: subtotal * taxRate,
      total: subtotal * (1 + taxRate)
    }

    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
    
  }, [state.cart]);


  const addProductToCart = ( product: ICartProduct ) => {

    const productInCart = state.cart.some( _product => _product._id === product._id);
    if (!productInCart) {
      return dispatch({ type: '[Cart] - Add Product', payload: [ ...state.cart, product ] });
    }
    
    const productInCartButDifferentSize = state.cart.some( _p => _p._id === _p._id && _p.size === product.size );
    if (!productInCartButDifferentSize) {
      return dispatch({ type: '[Cart] - Add Product', payload: [ ...state.cart, product ] });
    }

    const updatedProducts = state.cart.map( _p => {
      if ( _p._id !== product._id ) return _p;
      
      if ( _p.size !== product.size ) return _p;

      _p.quantity += product.quantity;
      return _p;
    })

    return dispatch({ type: '[Cart] - Add Product', payload: updatedProducts });

  }

  const updateCartQuantity = ( product: ICartProduct ) => {

    const newCart = state.cart.map( _product => {
      if (_product._id === product._id && _product.size === product.size) {
        return product;
      }
      return _product;
    })

    dispatch({ type: '[Cart] - Update Cart Quantity', payload: newCart});
    
  }
  
  const removeProductFromCart = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Remove Product from Cart', payload: product });
  }

  const updateAddress = ( address: ShippingAddress ) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('zip', address.zip);
    Cookie.set('city', address.city);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);

    dispatch({ type: '[Cart] - Update Address', payload: address });
  }

  const createOrder = async (): Promise<{ hasError: boolean; message: string; }> => {

    if ( !state.shippingAddress ) {
      throw new Error('No hay dirección de entrega');
    }

    const body: IOrder = {
      orderItems: state.cart.map( product => ({
        ...product,
        size: product.size!
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subtotal: state.subtotal,
      tax: state.tax,
      total: state.total,
      isPaid: false
    }

    try {
      
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      
      dispatch({ type: '[Cart] - Order complete' });
      
      Cookie.set('cart', JSON.stringify([]));

      return {
        hasError: false,
        message: data._id!,
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        const { message } = err.response?.data as { message: string };
        return {
          hasError: true,
          message,
        }
      }
      return {
        hasError: true,
        message: 'Error no controlado',
      }
    }
  }

  return (
    <CartContext.Provider value={
    {
      ...state,

      // Methods
      addProductToCart,
      updateCartQuantity,
      removeProductFromCart,
      updateAddress,
      createOrder,
    }
  }>
    { children }
  </CartContext.Provider>
  )
}