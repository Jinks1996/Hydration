import { render } from '@testing-library/react';

import UserMenuOptions from './user-menu-options';

describe('UserMenuOptions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserMenuOptions />);
    expect(baseElement).toBeTruthy();
  });
});
