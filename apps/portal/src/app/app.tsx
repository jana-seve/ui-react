import React, { Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styles from './app.module.less';
import { HomePage } from '@covid-essentials/portal/feature-home';
// import { RegisterationPage } from '@covid-essentials-portal-react/portal/feature-register';
import {
  CircularProgress,
  Container,
  createMuiTheme,
  CssBaseline,
  Grid,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { lightBlue } from '@material-ui/core/colors';
import { QueryClient, QueryClientProvider } from 'react-query';

const AsyncRegistrationPage = React.lazy(
  () => import('@covid-essentials/portal/feature-register')
);

const AsyncAdminPage = React.lazy(
  () => import('@covid-essentials/portal/feature-admin')
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    },
  },
});

export function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: lightBlue,
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <Grid
              container
              display="flex"
              flexDirection="row"
              height="100%"
              width="100%"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <CircularProgress />
              <Typography variant="body1">Loading</Typography>
            </Grid>
          }
        >
          <BrowserRouter>
            <Container fixed className={styles.container}>
              <Switch>
                <Route path="/" exact component={HomePage} />
                <Route
                  path="/register"
                  exact
                  component={AsyncRegistrationPage}
                />
                <Route
                  path="/profile/:id"
                  component={AsyncRegistrationPage}
                />
                <Route
                  path="/admin/:id"
                  component={AsyncAdminPage}
                />
              </Switch>
            </Container>
          </BrowserRouter>
        </Suspense>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
