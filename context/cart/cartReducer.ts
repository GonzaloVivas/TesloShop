import { CartState } from './';
import { ICartProduct, ShippingAddress } from '../../interfaces';

type CartActionType =
  | { type: '[Cart] - Load Cart from cookies | storage', payload: ICartProduct[] }
  | { type: '[Cart] - Add Product', payload: ICartProduct[] }
  | { type: '[Cart] - Update Cart Quantity', payload: ICartProduct[] }
  | { type: '[Cart] - Remove Product from Cart', payload: ICartProduct }
  | { type: '[Cart] - Load Address from Cookies', payload: ShippingAddress }
  | { type: '[Cart] - Update Address', payload: ShippingAddress }
  | {
    type: '[Cart] - Update order summary',
    payload: {
      numberOfItems: number;
      subtotal: number;
      tax: number;
      total: number;
    }
  }
  | { type: '[Cart] - Order complete' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

  switch (action.type) {
    case '[Cart] - Load Cart from cookies | storage':
      return {
        ...state,
        isLoaded: true,
        cart: action.payload,
      }
  
    case '[Cart] - Add Product':
      return {
        ...state,
        cart: [ ...action.payload ],
      }
  
    case '[Cart] - Update Cart Quantity':
      return {
        ...state,
        cart: [ ...action.payload ],
      }
  
    case '[Cart] - Remove Product from Cart':
      return {
        ...state,
        cart: state.cart.filter( p => !(p._id === action.payload._id && p.size === action.payload.size) ),
      }

    case '[Cart] - Update order summary':
      return {
        ...state,
        ...action.payload,

      }
  
    case '[Cart] - Load Address from Cookies':
    case '[Cart] - Update Address':
      return {
        ...state,
        shippingAddress: action.payload,
      }
  
    case '[Cart] - Order complete':
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subtotal: 0,
        tax: 0,
        total: 0,
      }
  
    default:
      return state;
  }

}