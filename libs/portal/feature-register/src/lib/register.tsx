import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { isEmpty, noop, partialRight } from 'lodash';
import { Field, Form } from 'react-final-form';
import { validateOrgAddress, validateRequired } from './validators';
import { ArrayInputField } from './array_input';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createOrganization,
  updateOrganization,
  getOrganization,
} from '@covid-essentials/portal/data-access';
import { FORM_ERROR } from 'final-form';
import WarningIcon from '@material-ui/icons/Warning';
import { getUserLocation, ILocation, STATES_MAP } from '@covid-essentials/shared/utils';

const STATES = Object.values(STATES_MAP);

function RegisterationPage() {
  const { palette } = useTheme();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<ILocation>({});
  const { id } = useParams<{ id: string }>();

  const { isLoading, isError, data, error } = useQuery(
    ['org', id || '__new__'],
    () => getOrganization(id || '__new__')
  );
  const initialValues = id ? data : {...data, ...location};

  const createMutation = useMutation(createOrganization);
  const updateMutation = useMutation(updateOrganization);
  const mutation = id ? updateMutation : createMutation;

  const client = useQueryClient();

  useEffect(() => {
    if (id) {
      return;
    }

    getUserLocation(setLocation, noop);
  }, []);

  function onSubmit(values, _, callback) {
    setOpen(false);
    setSubmitting(true);
    mutation.mutate(values, {
      onSuccess: (data, variables, context) => {
        client.setQueryData(['org', data['id']], data);
      },
      onSettled: (data, error, variables) => {
        setSubmitting(false);
        if (error) {
          setOpen(true);
          callback({ [FORM_ERROR]: error['data'] });
        } else {
          callback();
          history.push(`/admin/${data['id']}`);
        }
      },
    });
  }

  return (
    <Box width="100%" padding={2} mb={10}>
      <Typography variant="h5">Covid Essentials Portal</Typography>
      <Typography variant="subtitle1" mt={4}>
        Register Yourself
      </Typography>
      <Paper
        sx={{
          background: palette.warning.main,
          padding: '6px',
          marginTop: '6px',
        }}
      >
        <Typography variant="subtitle2" textAlign="justify">
          Since this is a crowdsourced portal, we don’t have the means to verify
          the authenticity of the data you provide. We assume that you are
          responsible enough and the data you provide is true to the best of
          your knowledge.
        </Typography>
      </Paper>
      {isLoading ? (
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Container>
      ) : isError ? (
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <WarningIcon />
          <Typography variant="body2">
            Something went wrong. Please try again later.
          </Typography>
        </Container>
      ) : (
        <Form
          onSubmit={onSubmit}
          initialValues={initialValues}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Grid container mt={4} pb={2} display="flex" spacing={2}>
                <Grid item container xs={12} md={6} display="flex" spacing={2}>
                  <Grid item xs={12}>
                    <Field name="name" validate={validateRequired}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Your Name"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="state" validate={validateRequired}>
                      {({ input: { value, onChange, ...props }, meta }) => (
                        <Autocomplete
                          fullWidth
                          disablePortal
                          autoComplete={true}
                          autoSelect={true}
                          value={value}
                          options={STATES}
                          renderInput={(params) => (
                            <TextField
                              required
                              {...params}
                              {...props}
                              name="state"
                              label="State"
                              error={meta.touched && !isEmpty(meta.error)}
                              helperText={
                                meta.touched &&
                                !isEmpty(meta.error) &&
                                meta.error
                              }
                            />
                          )}
                          onChange={(evt, val) => onChange(val)}
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="city" validate={validateRequired}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="City"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="area" validate={validateRequired}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Area"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="pin_code"
                      validate={validateRequired}
                      type="number"
                    >
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Pincode"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="latitude" validate={validateRequired}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          type="number"
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Latitude"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="longitude" validate={validateRequired}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          required
                          type="number"
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Longitude"
                          helperText={
                            meta.touched && !isEmpty(meta.error) && meta.error
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="org_name">
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          {...input}
                          label="Organization Name"
                          helperText="If you are an organisation providing beds/O2."
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="org_type">
                      {({ input, meta }) => (
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Organization Type</InputLabel>
                          <Select {...input} label="Organization Type">
                            <MenuItem value="ngo">
                              Not for Profit (NGO)
                            </MenuItem>
                            <MenuItem value="volunteers">
                              Volunteer Driven
                            </MenuItem>
                            <MenuItem value="private">Private</MenuItem>
                            <MenuItem value="government">Government</MenuItem>
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="address" validate={validateOrgAddress}>
                      {({ input, meta }) => (
                        <TextField
                          fullWidth
                          {...input}
                          error={meta.touched && !isEmpty(meta.error)}
                          label="Organization Address"
                          helperText={
                            (meta.touched &&
                              !isEmpty(meta.error) &&
                              meta.error) ||
                            'Publicly displayed address in search results.'
                          }
                        />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="email" type="text">
                      {({ input, meta }) => (
                        <ArrayInputField label="Email" {...input} />
                      )}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field name="phone" type="text">
                      {({ input, meta }) => (
                        <ArrayInputField
                          label="Phone"
                          prefix="+91"
                          {...input}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} mt={2} mb={2}>
                <Divider></Divider>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button type="submit" fullWidth variant="contained">
                  {submitting ? <CircularProgress size="16" /> : ''} Register
                </Button>
              </Grid>
            </form>
          )}
        />
      )}
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="error">
          Failed to create record. Please try again or try later.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export { RegisterationPage };
