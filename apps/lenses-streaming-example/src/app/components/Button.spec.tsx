import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';
import { render, fireEvent, screen  } from "@testing-library/react";

describe("<Button />", () => {
  test("should be able to render the button", async () => {
    const props = { children: ['Commit'], className:'' };
     render(<Button {...props} />); 
     expect(screen.getByRole('button')).toBeDefined()
  });
});