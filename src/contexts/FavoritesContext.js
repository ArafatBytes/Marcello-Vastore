"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { getCurrentUser, isLoggedIn, getUserId } from "@/utils/auth";

const FavoritesContext = createContext();

// Favorites actions
const FAVORITES_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_FAVORITES: "CLEAR_FAVORITES",
  LOAD_FAVORITES: "LOAD_FAVORITES",
};

// Favorites reducer
function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITES_ACTIONS.ADD_ITEM: {
      const { product } = action.payload;

      // Use _id for MongoDB products
      const productId = product._id || product.id;

      // Check if item already exists
      const existingItemIndex = state.items.findIndex(
        (item) => item._id === productId
      );

      if (existingItemIndex >= 0) {
        // Item already in favorites, don't add duplicate
        return state;
      } else {
        // Add new item
        const newItem = {
          _id: productId,
          name: product.name,
          price: product.price,
          image: product.image || product.mainImage || product.images?.[0],
          reference: product.reference,
          colors: product.colors,
          sizes: product.sizes,
          addedAt: new Date().toISOString(),
        };

        const updatedItems = [...state.items, newItem];

        return {
          ...state,
          items: updatedItems,
          totalItems: updatedItems.length,
        };
      }
    }

    case FAVORITES_ACTIONS.REMOVE_ITEM: {
      const updatedItems = state.items.filter(
        (item) => item._id !== action.payload
      );

      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.length,
      };
    }

    case FAVORITES_ACTIONS.CLEAR_FAVORITES:
      return {
        items: [],
        totalItems: 0,
      };

    case FAVORITES_ACTIONS.LOAD_FAVORITES: {
      const loadedFavorites = action.payload;

      return {
        items: loadedFavorites.items || [],
        totalItems: (loadedFavorites.items || []).length,
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
};

// Favorites provider component
export function FavoritesProvider({ children }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, initialState);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Load favorites from localStorage
  const loadFavoritesFromLocalStorage = React.useCallback(() => {
    try {
      const savedFavorites = localStorage.getItem("marcello-favorites");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (parsedFavorites.items && parsedFavorites.items.length > 0) {
          console.log("Loading favorites from localStorage:", parsedFavorites);
          dispatch({
            type: FAVORITES_ACTIONS.LOAD_FAVORITES,
            payload: parsedFavorites,
          });
        }
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  // Load favorites from database
  const loadFavoritesFromDatabase = React.useCallback(async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (
          data.favorites &&
          data.favorites.items &&
          data.favorites.items.length > 0
        ) {
          dispatch({
            type: FAVORITES_ACTIONS.LOAD_FAVORITES,
            payload: data.favorites,
          });
        }
      }
    } catch (error) {
      console.error("Error loading favorites from database:", error);
      // Fallback to localStorage if database fails
      loadFavoritesFromLocalStorage();
    }
  }, [userId, loadFavoritesFromLocalStorage]);

  // Save favorites to database
  const saveFavoritesToDatabase = React.useCallback(async () => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          favorites,
        }),
      });
    } catch (error) {
      console.error("Error saving favorites to database:", error);
      // Fallback to localStorage if database fails
      localStorage.setItem("marcello-favorites", JSON.stringify(favorites));
    }
  }, [userId, favorites]);

  // Check if user is logged in using existing JWT authentication
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = isLoggedIn();
      const currentUserId = getUserId();

      setUserLoggedIn(loggedIn);
      setUserId(currentUserId);
    };

    if (typeof window !== "undefined") {
      checkAuthStatus();

      // Listen for login/logout events
      const handleAuthChange = () => {
        checkAuthStatus();
      };

      window.addEventListener("storage", handleAuthChange);
      window.addEventListener("custom-login", handleAuthChange);

      return () => {
        window.removeEventListener("storage", handleAuthChange);
        window.removeEventListener("custom-login", handleAuthChange);
      };
    }
  }, []);

  // Load favorites from appropriate storage on mount
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggingOut) {
      if (userLoggedIn && userId) {
        // Load from database for logged-in users
        loadFavoritesFromDatabase();
      } else if (!userLoggedIn) {
        // Only load from localStorage for non-logged-in users if not in logout process
        loadFavoritesFromLocalStorage();
      }
    }
  }, [
    userLoggedIn,
    userId,
    loadFavoritesFromDatabase,
    loadFavoritesFromLocalStorage,
    isLoggingOut,
  ]);

  // Save favorites to appropriate storage whenever favorites changes
  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggingOut) {
      const timeoutId = setTimeout(() => {
        if (userLoggedIn && userId) {
          // Save to database for logged-in users
          saveFavoritesToDatabase();
        } else {
          // Save to localStorage for non-logged-in users
          localStorage.setItem("marcello-favorites", JSON.stringify(favorites));
        }
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    }
  }, [favorites, userLoggedIn, userId, saveFavoritesToDatabase, isLoggingOut]);

  // Add item to favorites
  const addToFavorites = (product) => {
    dispatch({
      type: FAVORITES_ACTIONS.ADD_ITEM,
      payload: { product },
    });
  };

  // Remove item from favorites
  const removeFromFavorites = (productId) => {
    dispatch({ type: FAVORITES_ACTIONS.REMOVE_ITEM, payload: productId });
  };

  // Check if item is in favorites
  const isFavorite = (productId) => {
    return favorites.items.some((item) => item._id === productId);
  };

  // Toggle favorite status
  const toggleFavorite = (product) => {
    const productId = product._id || product.id;
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(product);
    }
  };

  // Clear entire favorites
  const clearFavorites = () => {
    dispatch({ type: FAVORITES_ACTIONS.CLEAR_FAVORITES });
  };

  // Sync favorites when user logs in (merge localStorage favorites with database favorites)
  const syncFavoritesOnLogin = async () => {
    if (typeof window !== "undefined") {
      const loggedIn = isLoggedIn();
      const currentUserId = getUserId();

      if (loggedIn && currentUserId) {
        // Update state
        setUserId(currentUserId);
        setUserLoggedIn(true);

        // Get current localStorage favorites
        const localFavorites = localStorage.getItem("marcello-favorites");
        let localFavoritesData = null;

        if (localFavorites) {
          try {
            localFavoritesData = JSON.parse(localFavorites);
          } catch (error) {
            console.error("Error parsing local favorites:", error);
          }
        }

        // Load the existing database favorites first
        try {
          const response = await fetch(
            `/api/favorites?userId=${currentUserId}`
          );
          let databaseFavorites = null;

          if (response.ok) {
            const data = await response.json();
            databaseFavorites = data.favorites;
          }

          // Merge localStorage favorites with database favorites
          let mergedFavorites = {
            items: [],
            totalItems: 0,
          };

          // Start with database favorites if they exist
          if (
            databaseFavorites &&
            databaseFavorites.items &&
            databaseFavorites.items.length > 0
          ) {
            mergedFavorites.items = [...databaseFavorites.items];
          }

          // Merge localStorage favorites if they exist
          if (
            localFavoritesData &&
            localFavoritesData.items &&
            localFavoritesData.items.length > 0
          ) {
            console.log(
              "Merging localStorage favorites with database favorites"
            );

            // Add each localStorage item if it doesn't already exist in database
            localFavoritesData.items.forEach((localItem) => {
              const existsInDatabase = mergedFavorites.items.some(
                (dbItem) => dbItem._id === localItem._id
              );

              if (!existsInDatabase) {
                mergedFavorites.items.push(localItem);
              }
            });
          }

          // Update total items count
          mergedFavorites.totalItems = mergedFavorites.items.length;

          // If we have any favorites (merged or otherwise), save and load them
          if (mergedFavorites.items.length > 0) {
            console.log(
              `Merged ${mergedFavorites.items.length} total favorites (${
                databaseFavorites?.items?.length || 0
              } from DB + ${
                localFavoritesData?.items?.length || 0
              } from localStorage)`
            );

            // Save merged favorites to database
            await fetch("/api/favorites", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: currentUserId,
                favorites: mergedFavorites,
              }),
            });

            // Load merged favorites into current state
            dispatch({
              type: FAVORITES_ACTIONS.LOAD_FAVORITES,
              payload: mergedFavorites,
            });
          } else if (
            databaseFavorites &&
            databaseFavorites.items &&
            databaseFavorites.items.length > 0
          ) {
            // Only database favorites exist, load them
            dispatch({
              type: FAVORITES_ACTIONS.LOAD_FAVORITES,
              payload: databaseFavorites,
            });
          }

          // Clear localStorage favorites after merging
          if (localFavoritesData) {
            localStorage.removeItem("marcello-favorites");
          }
        } catch (error) {
          console.error("Error handling favorites sync on login:", error);
          // Fallback to localStorage favorites if database fails
          if (
            localFavoritesData &&
            localFavoritesData.items &&
            localFavoritesData.items.length > 0
          ) {
            dispatch({
              type: FAVORITES_ACTIONS.LOAD_FAVORITES,
              payload: localFavoritesData,
            });
          }
        }
      }
    }
  };

  // Handle user logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Set logging out flag to prevent automatic saves
      setIsLoggingOut(true);

      // Clear the favorites completely on logout
      dispatch({ type: FAVORITES_ACTIONS.CLEAR_FAVORITES });

      // Clear localStorage favorites to ensure clean state
      localStorage.removeItem("marcello-favorites");

      // Update auth state
      setUserId(null);
      setUserLoggedIn(false);

      // Reset logging out flag after a brief delay
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 100);

      // The favorites will now be empty for non-logged users
    }
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    syncFavoritesOnLogin,
    handleLogout,
    isLoggedIn: userLoggedIn,
    userId,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
