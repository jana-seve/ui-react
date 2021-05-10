import {
  Button,
  createStyles,
  makeStyles,
  TextField,
  Theme,
} from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    unused: {
      borderColor: theme.palette.divider,
      color: theme.palette.divider,
    },
  })
);

export function CounterInput({ label, value, onChange }) {
  const styles = useStyles();

  const changeValue = (val) => {
    if (val >= 0) {
      onChange(val);
    }
  };

  return (
    <TextField
      label={label}
      value={value}
      type="number"
      inputProps={{ min: 0, style: { textAlign: 'center' } }}
      InputProps={{
        readOnly: true,
        startAdornment: (
          <Button
            variant="outlined"
            className={value === 0 ? styles.unused : null}
            onClick={() => changeValue(value - 1)}
          >
            <RemoveIcon />
          </Button>
        ),
        endAdornment: (
          <Button
            variant="outlined"
            className={value === 0 ? styles.unused : null}
            onClick={() => changeValue(value + 1)}
          >
            <AddIcon />
          </Button>
        ),
      }}
    />
  );
}
