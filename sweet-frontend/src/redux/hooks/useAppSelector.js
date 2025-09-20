// src/redux/hooks/useAppSelector.js
import { useSelector } from "react-redux";

// simple wrapper for consistency
export const useAppSelector = (selector) => useSelector(selector);
