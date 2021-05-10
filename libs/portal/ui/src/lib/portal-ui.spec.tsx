import React from 'react';
import { render } from '@testing-library/react';

import PortalUi from './portal-ui';

describe('PortalUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PortalUi />);
    expect(baseElement).toBeTruthy();
  });
});
