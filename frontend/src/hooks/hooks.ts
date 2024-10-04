// hooks.ts

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store.ts';

// Define a custom hook for dispatch with type
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Define a custom hook for selector with typed RootState
export const useAppSelector = <TSelected>(selector: (state: RootState) => TSelected): TSelected =>
    useSelector(selector);
