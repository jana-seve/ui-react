import React, { useCallback, useState } from 'react';
import { Stack, Typography } from '@material-ui/core';
import { CounterInput } from './counter-input';
import { debounce } from 'lodash';

export function StatsContainer({ label, resource, onChange }) {
  const [_resource, setResource] = useState(resource);

  const _onChange = useCallback(debounce(onChange, 8000), []);

  const _onResourceChange = useCallback((val) => {
    const res = {..._resource, ...val};
    setResource(res);
    _onChange(res);
  }, [_resource]);

  return (
    <Stack spacing={2}>
      <Typography variant="body1" fontWeight="bold">
        {label}
      </Typography>
      <CounterInput
        label="Total"
        value={_resource.total}
        onChange={(val) => _onResourceChange({ total: val })}
      />
      <CounterInput
        label="Available"
        value={_resource.available}
        onChange={(val) => _onResourceChange({ available: val })}
      />
    </Stack>
  );
}
