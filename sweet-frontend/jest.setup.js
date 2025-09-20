// Polyfill TextEncoder/TextDecoder for Jest (required by some libs)
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock sonner Toaster to avoid rendering issues in tests
jest.mock('sonner', () => ({
  Toaster: () => null,
}));

// Optional: Extend expect for RTL helpers
// import '@testing-library/jest-dom/extend-expect';
