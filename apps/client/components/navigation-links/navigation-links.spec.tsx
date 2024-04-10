import { render } from '@testing-library/react';

import NavigationLinks from './navigation-links';

describe('NavigationLinks', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavigationLinks />);
    expect(baseElement).toBeTruthy();
  });
});
