import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  Paper,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createResource,
  getResources,
  updateResource,
} from '@covid-essentials/portal/data-access';
import EditIcon from '@material-ui/icons/Edit';
import WarningIcon from '@material-ui/icons/Warning';
import { filter, findIndex, first, partial } from 'lodash';
import { StatsContainer } from './stats';
// import { Link } from 'react-router-dom';

export enum Resource {
  NormalBeds,
  O2Beds,
  ICUBeds,
  VentilatorBeds,
  O2Concentrators,
  O2Cylinders,
}

export function AdminPage(props) {
  const { palette } = useTheme();
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const _createResource = useMutation(partial(createResource, id));
  const _updateResource = useMutation(partial(updateResource, id));

  const { isLoading, isError, data, error } = useQuery(['resources', id], () =>
    getResources(id)
  );

  function getResource(resource_type) {
    return (
      first(filter(data, { resource_type })) || {
        total: 0,
        available: 0,
        open_for_service: true,
        resource_type,
      }
    );
  }

  function onChange(resource_type, resource) {
    const onSuccess = (result) => {
      const _data: Record<
        string,
        string | number | boolean
      >[] = queryClient.getQueryData(['resources', id]);
      const index = findIndex(_data, { resource_type });
      if (index === -1) {
        // create
        _data.push(result);
      } else {
        _data[index] = result;
      }

      queryClient.setQueryData(['resources', id], [..._data]);
    };

    if (!resource.id) {
      _createResource.mutate(resource, { onSuccess });
    } else {
      _updateResource.mutate(resource, { onSuccess });
    }
  }

  const normalBeds = getResource(Resource.NormalBeds);
  const o2Beds = getResource(Resource.O2Beds);
  const icuBeds = getResource(Resource.ICUBeds);
  const ventilatorBeds = getResource(Resource.VentilatorBeds);
  const o2Concentrators = getResource(Resource.O2Concentrators);
  const o2Cylinders = getResource(Resource.O2Cylinders);

  return (
    <Box width="100%" padding={2} mb={10}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Covid Essentials Portal</Typography>
        <Typography variant="body2">
          <Link href="/">Home</Link>
        </Typography>
      </Stack>
      <Typography variant="subtitle1" mt={4}>
        Manage your Profile & Services
      </Typography>
      <Paper
        sx={{
          background: palette.warning.main,
          padding: '6px',
          marginTop: '6px',
        }}
      >
        <Typography variant="subtitle2" textAlign="justify">
          Please bookmark this page for future administration purposes. The link
          to this page has also been mailed to you for future reference. Do not
          share the link with users who are not directly resposible for managing
          your service.
        </Typography>
      </Paper>

      <Grid container mt={2}>
        <Grid item xs={12}>
          <div>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => history.push(`/profile/${id}`)}
            >
              Edit profile
            </Button>
          </div>
        </Grid>
        {isLoading ? (
          <Container
            sx={{
              marginTop: '25px',
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
              marginTop: '25px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <WarningIcon color="secondary" /> &nbsp;
            <Typography variant="body2" color="secondary">
              Something went wrong. Couldn't get the services your provide.
            </Typography>
          </Container>
        ) : (
          <>
            <Grid item xs={12} mt={2}>
              <Stack>
                <Typography variant="h6">Beds</Typography>
                <Typography variant="body2" color="GrayText">
                  If your organization offers beds, please enter details for
                  different types of beds you offer.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="General/Normal Beds"
                        resource={normalBeds}
                        onChange={(val) =>
                          onChange(Resource.NormalBeds, {
                            ...normalBeds,
                            ...val,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="Beds with Oxygen support"
                        resource={o2Beds}
                        onChange={(val) =>
                          onChange(Resource.O2Beds, { ...o2Beds, ...val })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="ICU Beds"
                        resource={icuBeds}
                        onChange={(val) =>
                          onChange(Resource.ICUBeds, { ...icuBeds, ...val })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="Ventilator Beds"
                        resource={ventilatorBeds}
                        onChange={(val) =>
                          onChange(Resource.VentilatorBeds, {
                            ...ventilatorBeds,
                            ...val,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} mt={2}>
              <Stack>
                <Typography variant="h6">Oxygen</Typography>
                <Typography variant="body2" color="GrayText">
                  If you are selling and/or renting (either for money or free)
                  oxygen concentrators/cylinders, please specify the numbers for
                  each.
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} mt={1}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="Concentrators"
                        resource={o2Concentrators}
                        onChange={(val) =>
                          onChange(Resource.O2Concentrators, {
                            ...o2Concentrators,
                            ...val,
                          })
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <StatsContainer
                        label="Cylinders"
                        resource={o2Cylinders}
                        onChange={(val) =>
                          onChange(Resource.O2Cylinders, {
                            ...o2Cylinders,
                            ...val,
                          })
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert onClose={() => setOpen(false)} severity="error">
          Failed to update resource. Please try again later.
        </Alert>
      </Snackbar>
    </Box>
  );
}
