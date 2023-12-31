import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import csgoDataService from './csgoDataService'

const initialState = {
  csgodata: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const getCsgoData = createAsyncThunk(
  'csgodata/get',
  async (x) => {
    try {
      return await csgoDataService.getCsgoData(x)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message
        ) ||
        error.message ||
        error.toString()
      return x.rejectWithValue(message)
    }
  }
)

export const csgoDataSlice = createSlice({
  name: 'csgodata',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCsgoData.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCsgoData.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.csgodata = action.payload
      })
      .addCase(getCsgoData.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.csgodata = action.payload
      })
  },
})

export const { reset } = csgoDataSlice.actions
export default csgoDataSlice.reducer