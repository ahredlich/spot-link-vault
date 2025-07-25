import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ViewToggle } from '../ViewToggle';

describe('ViewToggle', () => {
  it('renders grid and list buttons', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="grid" 
        onViewModeChange={mockOnViewModeChange} 
      />
    );
    
    expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
    expect(screen.getByLabelText('List view')).toBeInTheDocument();
  });

  it('applies active state to grid button when viewMode is grid', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="grid" 
        onViewModeChange={mockOnViewModeChange} 
      />
    );
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(gridButton).toHaveClass('view-toggle-active');
    expect(listButton).toHaveClass('view-toggle-inactive');
    expect(gridButton).toHaveAttribute('aria-pressed', 'true');
    expect(listButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies active state to list button when viewMode is list', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="list" 
        onViewModeChange={mockOnViewModeChange} 
      />
    );
    
    const gridButton = screen.getByLabelText('Grid view');
    const listButton = screen.getByLabelText('List view');
    
    expect(listButton).toHaveClass('view-toggle-active');
    expect(gridButton).toHaveClass('view-toggle-inactive');
    expect(listButton).toHaveAttribute('aria-pressed', 'true');
    expect(gridButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls onViewModeChange when grid button is clicked', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="list" 
        onViewModeChange={mockOnViewModeChange} 
      />
    );
    
    const gridButton = screen.getByLabelText('Grid view');
    fireEvent.click(gridButton);
    
    expect(mockOnViewModeChange).toHaveBeenCalledWith('grid');
  });

  it('calls onViewModeChange when list button is clicked', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="grid" 
        onViewModeChange={mockOnViewModeChange} 
      />
    );
    
    const listButton = screen.getByLabelText('List view');
    fireEvent.click(listButton);
    
    expect(mockOnViewModeChange).toHaveBeenCalledWith('list');
  });

  it('applies custom className when provided', () => {
    const mockOnViewModeChange = vi.fn();
    
    render(
      <ViewToggle 
        viewMode="grid" 
        onViewModeChange={mockOnViewModeChange}
        className="custom-class"
      />
    );
    
    const container = screen.getByLabelText('Grid view').closest('.view-toggle-group');
    expect(container).toHaveClass('custom-class');
  });
});