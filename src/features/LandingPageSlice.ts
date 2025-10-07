import { createSlice } from '@reduxjs/toolkit'

interface LandingState {
  animationsEnabled: boolean
  ctaClicks: number
}

const initialState: LandingState = {
  animationsEnabled: true,
  ctaClicks: 0,
}

const LandingPageSlice = createSlice({
  name: 'landing',
  initialState,
  reducers: {
    toggleAnimations: (state) => {
      state.animationsEnabled = !state.animationsEnabled
    },
    setAnimationsEnabled: (state, action: { payload: boolean }) => {
      state.animationsEnabled = action.payload
    },
    incrementCtaClicks: (state) => {
      state.ctaClicks += 1
    },
  },
})

export const { toggleAnimations, setAnimationsEnabled, incrementCtaClicks } = LandingPageSlice.actions
export default LandingPageSlice.reducer
