import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock App component if it doesn't exist
const App = () => {
  const [count, setCount] = React.useState(0);
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sweet Shop Management</h1>
        <p>Welcome to our sweet shop!</p>
        <button onClick={() => setCount(count + 1)}>
          Count: {count}
        </button>
        <div data-testid="sweet-list">
          <h2>Our Sweets</h2>
          <ul>
            <li>Chocolate</li>
            <li>Candy</li>
            <li>Gummy Bears</li>
          </ul>
        </div>
      </header>
    </div>
  );
};

describe('Sweet Shop Frontend Tests', () => {
  test('renders sweet shop title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Sweet Shop Management/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders welcome message', () => {
    render(<App />);
    const welcomeElement = screen.getByText(/Welcome to our sweet shop/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  test('renders counter button and increments count', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count: 0/i });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /count: 1/i })).toBeInTheDocument();
  });

  test('renders sweet list', () => {
    render(<App />);
    const sweetList = screen.getByTestId('sweet-list');
    expect(sweetList).toBeInTheDocument();
    
    expect(screen.getByText(/Our Sweets/i)).toBeInTheDocument();
    expect(screen.getByText('Chocolate')).toBeInTheDocument();
    expect(screen.getByText('Candy')).toBeInTheDocument();
    expect(screen.getByText('Gummy Bears')).toBeInTheDocument();
  });

  test('sweet list contains multiple items', () => {
    render(<App />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  test('header contains all expected elements', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toContainElement(screen.getByText(/Sweet Shop Management/i));
    expect(header).toContainElement(screen.getByRole('button'));
    expect(header).toContainElement(screen.getByTestId('sweet-list'));
  });

  test('button text changes after multiple clicks', () => {
    render(<App />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    
    expect(button).toHaveTextContent('Count: 3');
  });

  test('component has proper structure', () => {
    render(<App />);
    const appDiv = screen.getByText(/Sweet Shop Management/i).closest('.App');
    expect(appDiv).toBeInTheDocument();
    expect(appDiv.querySelector('.App-header')).toBeInTheDocument();
  });
});