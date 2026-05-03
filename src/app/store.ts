import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "@/features/auth/model/authSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  })
}

// Типизация
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
