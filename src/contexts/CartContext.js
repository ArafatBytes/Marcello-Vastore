'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentUser, isLoggedIn, getUserId } from '@/utils/auth';

const CartContext = createContext();

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, selectedSize, selectedColor, quantity } = action.payload;
      
      // Create unique item key based on product id, size, and color
      const itemKey = `${product.id}-${selectedSize}-${selectedColor.name}`;
      
      // Check if item already exists
      const existingItemIndex = state.items.findIndex(item => item.key === itemKey);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        
        // Recalculate totals from scratch to ensure accuracy
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          ...state,
          items: updatedItems,
          totalItems,
          totalPrice
        };
      } else {
        // Add new item
        const newItem = {
          key: itemKey,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.mainImage || product.images[0],
          size: selectedSize,
          color: selectedColor,
          quantity: quantity,
          reference: product.reference
        };
        
        const updatedItems = [...state.items, newItem];
        
        // Recalculate totals from scratch to ensure accuracy
        const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          ...state,
          items: updatedItems,
          totalItems,
          totalPrice
        };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(item => item.key !== action.payload);
      
      // Recalculate totals from scratch
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemKey, newQuantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.key === itemKey);
      
      if (itemIndex === -1 || newQuantity <= 0) return state;
      
      const updatedItems = [...state.items];
      updatedItems[itemIndex].quantity = newQuantity;
      
      // Recalculate totals from scratch to ensure accuracy
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    
    case CART_ACTIONS.LOAD_CART: {
      const loadedCart = action.payload;
      
      // Recalculate totals to ensure consistency
      const totalItems = loadedCart.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = loadedCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        ...loadedCart,
        totalItems,
        totalPrice
      };
    }
    
    default:
      return state;
  }
}

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Cart provider component
export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Function to fix any inconsistent cart data
  const fixCartConsistency = React.useCallback(() => {
    if (cart.items.length > 0) {
      const calculatedTotalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      const calculatedTotalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Check if stored totals match calculated totals
      if (cart.totalItems !== calculatedTotalItems || Math.abs(cart.totalPrice - calculatedTotalPrice) > 0.01) {
        console.log('Cart inconsistency detected, fixing...');
        console.log('Current cart:', cart);
        console.log('Calculated totals:', { totalItems: calculatedTotalItems, totalPrice: calculatedTotalPrice });
        
        // Fix the cart by recalculating totals
        dispatch({
          type: CART_ACTIONS.LOAD_CART,
          payload: {
            items: cart.items,
            totalItems: calculatedTotalItems,
            totalPrice: calculatedTotalPrice
          }
        });
      }
    }
  }, [cart]);

  // Load cart from localStorage
  const loadCartFromLocalStorage = React.useCallback(() => {
    try {
      const savedCart = localStorage.getItem('marcello-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart.items && parsedCart.items.length > 0) {
          // Debug logging to identify inconsistencies
          console.log('Loading cart from localStorage:', parsedCart);
          const calculatedTotalItems = parsedCart.items.reduce((sum, item) => sum + item.quantity, 0);
          const calculatedTotalPrice = parsedCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          console.log('Stored totals:', { totalItems: parsedCart.totalItems, totalPrice: parsedCart.totalPrice });
          console.log('Calculated totals:', { totalItems: calculatedTotalItems, totalPrice: calculatedTotalPrice });
          
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Load cart from database
  const loadCartFromDatabase = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.cart && data.cart.items && data.cart.items.length > 0) {
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: data.cart });
        }
      }
    } catch (error) {
      console.error('Error loading cart from database:', error);
      // Fallback to localStorage if database fails
      loadCartFromLocalStorage();
    }
  }, [userId, loadCartFromLocalStorage]);

  // Save cart to database
  const saveCartToDatabase = React.useCallback(async () => {
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          cart
        }),
      });
    } catch (error) {
      console.error('Error saving cart to database:', error);
      // Fallback to localStorage if database fails
      localStorage.setItem('marcello-cart', JSON.stringify(cart));
    }
  }, [userId, cart]);

  // Check if user is logged in using existing JWT authentication
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = isLoggedIn();
      const currentUserId = getUserId();
      
      setUserLoggedIn(loggedIn);
      setUserId(currentUserId);
    };

    if (typeof window !== 'undefined') {
      checkAuthStatus();
      
      // Listen for login/logout events
      const handleAuthChange = () => {
        checkAuthStatus();
      };
      
      window.addEventListener('storage', handleAuthChange);
      window.addEventListener('custom-login', handleAuthChange);
      
      return () => {
        window.removeEventListener('storage', handleAuthChange);
        window.removeEventListener('custom-login', handleAuthChange);
      };
    }
  }, []);

  // Load cart from appropriate storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoggingOut) {
      if (userLoggedIn && userId) {
        // Load from database for logged-in users
        loadCartFromDatabase();
      } else if (!userLoggedIn) {
        // Only load from localStorage for non-logged-in users if not in logout process
        loadCartFromLocalStorage();
      }
    }
  }, [userLoggedIn, userId, loadCartFromDatabase, loadCartFromLocalStorage, isLoggingOut]);

  // Check and fix cart consistency after cart changes
  useEffect(() => {
    if (cart.items.length > 0) {
      // Small delay to ensure all state updates are complete
      const timeoutId = setTimeout(() => {
        fixCartConsistency();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [cart.items.length, fixCartConsistency]);

  // Save cart to appropriate storage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoggingOut) {
      const timeoutId = setTimeout(() => {
        if (userLoggedIn && userId) {
          // Save to database for logged-in users
          saveCartToDatabase();
        } else {
          // Save to localStorage for non-logged-in users
          localStorage.setItem('marcello-cart', JSON.stringify(cart));
        }
      }, 500); // Increased debounce time for database calls
      
      return () => clearTimeout(timeoutId);
    }
  }, [cart, userLoggedIn, userId, saveCartToDatabase, isLoggingOut]);

  // Add item to cart
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, selectedSize, selectedColor, quantity }
    });
  };

  // Remove item from cart
  const removeFromCart = (itemKey) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemKey });
  };

  // Update item quantity
  const updateQuantity = (itemKey, newQuantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemKey, newQuantity }
    });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Sync cart when user logs in (merge localStorage cart with database cart)
  const syncCartOnLogin = async () => {
    if (typeof window !== 'undefined') {
      const loggedIn = isLoggedIn();
      const currentUserId = getUserId();
      
      if (loggedIn && currentUserId) {
        // Update state
        setUserId(currentUserId);
        setUserLoggedIn(true);
        
        // Get current localStorage cart
        const localCart = localStorage.getItem('marcello-cart');
        let localCartData = null;
        
        if (localCart) {
          try {
            localCartData = JSON.parse(localCart);
          } catch (error) {
            console.error('Error parsing local cart:', error);
          }
        }
        
        // Load the existing database cart first
        try {
          const response = await fetch(`/api/cart?userId=${currentUserId}`);
          let databaseCart = null;
          
          if (response.ok) {
            const data = await response.json();
            databaseCart = data.cart;
          }
          
          // If there's a local cart with items, handle the merge
          if (localCartData && localCartData.items && localCartData.items.length > 0) {
            // If database cart is empty, use localStorage cart
            if (!databaseCart || !databaseCart.items || databaseCart.items.length === 0) {
              console.log('Database cart is empty, using localStorage cart');
              await fetch('/api/cart', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userId: currentUserId,
                  cart: localCartData
                }),
              });
              
              // Load the localStorage cart into current state
              dispatch({ type: CART_ACTIONS.LOAD_CART, payload: localCartData });
            } else {
              // Database cart exists - prioritize database cart over localStorage
              console.log('Database cart exists, keeping database cart and discarding localStorage cart');
              dispatch({ type: CART_ACTIONS.LOAD_CART, payload: databaseCart });
            }
            
            // Clear localStorage cart after handling
            localStorage.removeItem('marcello-cart');
          } else if (databaseCart && databaseCart.items && databaseCart.items.length > 0) {
            // No localStorage cart, just load database cart
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: databaseCart });
          }
        } catch (error) {
          console.error('Error handling cart sync on login:', error);
          // Fallback to localStorage cart if database fails
          if (localCartData && localCartData.items && localCartData.items.length > 0) {
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: localCartData });
          }
        }
      }
    }
  };

  // Handle user logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Set logging out flag to prevent automatic saves
      setIsLoggingOut(true);
      
      // Clear the cart completely on logout
      dispatch({ type: CART_ACTIONS.CLEAR_CART });
      
      // Clear localStorage cart to ensure clean state
      localStorage.removeItem('marcello-cart');
      
      // Update auth state
      setUserId(null);
      setUserLoggedIn(false);
      
      // Reset logging out flag after a brief delay
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 100);
      
      // The cart will now be empty for non-logged users
    }
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCartOnLogin,
    handleLogout,
    isLoggedIn: userLoggedIn,
    userId
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
