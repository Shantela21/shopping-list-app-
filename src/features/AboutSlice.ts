import { createSlice } from '@reduxjs/toolkit'

interface AboutState {
  pageViews: number
  feedbackOpen: boolean
}

const initialState: AboutState = {
  pageViews: 0,
  feedbackOpen: false,
}

const AboutSlice = createSlice({
  name: 'about',
  initialState,
  reducers: {
    incrementPageViews: (state) => {
      state.pageViews += 1
    },
    setFeedbackOpen: (state, action: { payload: boolean }) => {
      state.feedbackOpen = action.payload
    },
    toggleFeedback: (state) => {
      state.feedbackOpen = !state.feedbackOpen
    },
  },
})

export const { incrementPageViews, setFeedbackOpen, toggleFeedback } = AboutSlice.actions
export default AboutSlice.reducer
