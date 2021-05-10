import React, { useEffect } from 'react';
import {
  Button,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useState } from 'react';

interface ArrayInputFieldProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  type?: string;
  prefix?: string;
}

function ArrayInputField({ label, value, onChange, type, prefix }: ArrayInputFieldProps) {
  const [values, setValues] = useState(value);

  useEffect(() => {
    onChange(values);
  }, [values]);

  return (
    <Grid item container spacing={1} mt={2}>
      {values.map((val, i) => (
        <Grid item xs={12} key={`${label}-${i}`}>
          <TextField
            fullWidth
            required
            type={type}
            label={`${label} #${i + 1}`}
            value={val}
            InputProps={{
              startAdornment: prefix ? <Typography variant="body1">{prefix}</Typography> : null,
              endAdornment:
                values.length > 1 ? (
                  <IconButton
                    color="secondary"
                    onClick={() => {
                      setValues([
                        ...values.slice(0, i),
                        ...values.slice(i + 1),
                      ]);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                ) : null,
            }}
            onChange={(evt) => {
              setValues([
                ...values.slice(0, i),
                evt.target.value,
                ...values.slice(i + 1),
              ]);
            }}
          />
        </Grid>
      ))}
      <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setValues([...values, ''])}
        >
          <Typography variant="body1">{`Add ${label}`}</Typography>
        </Button>
      </Grid>
    </Grid>
  );
}


export { ArrayInputField };
