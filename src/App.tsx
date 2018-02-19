import {Anchor, App as GrommetApp, Box, Footer, Header, Menu, Paragraph, Title} from 'grommet';
import {ActionsIcon} from 'grommet/components/icons/base';
import TriggerIcon from 'grommet/components/icons/base/Trigger';
import * as React from 'react';
import {connect} from 'react-redux';
import {Link, Route, Switch, withRouter} from 'react-router-dom';
import CreateSubscription from './pages/CreateSubscription';
import Home from './pages/Home';
import ListSubscriptions from './pages/ListSubscriptions';
import NotFound from './pages/NotFound';
import ViewSubscriptionPage from './pages/ViewSubscriptionPage';
import Auth from './util/auth';
import {AppState} from './reducers';
import {Auth0DecodedHash} from 'auth0-js';
import {RouteComponentProps} from 'react-router';

export const ActiveAnchor = ({path, ...rest}: { path: string }) => (
  <Route path={path} exact={true}>
    {({match, history}) => (
      <Anchor
        onClick={(e: any) => {
          e.preventDefault();
          history.push(path);
        }}
        href={path}
        className={match ? 'active' : ''}
        {...rest}
      />
    )}
  </Route>
);

export default withRouter(
  connect(
    ({auth: {loggedIn, principal}}: AppState) => ({loggedIn, principal}),
    {
      logout: () => {
        Auth.logout();
        return {
          type: 'LOGGED_OUT'
        };
      }
    }
  )(
    class App extends React.Component<RouteComponentProps<{}> & { loggedIn: boolean, logout: any, principal: Auth0DecodedHash | null }> {
      render() {
        const {loggedIn, logout, principal} = this.props;

        return (
          <div>
            <GrommetApp>
              <Header>
                <Title>
                  <Link to="/">
                    <TriggerIcon/>
                  </Link>
                  if-eth
                </Title>

                <Box flex={true} justify='end' direction='row' responsive={false}
                     alignContent="center">
                  <small style={{alignSelf: 'center'}}>
                    {
                      loggedIn && principal ?
                        `logged in as ${principal.idTokenPayload.sub}` :
                        'logged out'
                    }
                  </small>

                  <Menu icon={<ActionsIcon/>}
                        dropAlign={{'right': 'right'}}>
                    <ActiveAnchor path="/">Home</ActiveAnchor>
                    <ActiveAnchor path="/subscriptions">My Subscriptions</ActiveAnchor>
                    {
                      !loggedIn ?
                        <Anchor href="#" onClick={Auth.login}>Log in</Anchor> :
                        <Anchor href="#" onClick={logout}>Log out</Anchor>
                    }
                  </Menu>

                </Box>
              </Header>
            </GrommetApp>

            <GrommetApp>
              <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/subscriptions/new" exact component={CreateSubscription}/>
                <Route path="/subscriptions" exact component={ListSubscriptions}/>
                <Route path="/subscriptions/:id" exact component={ViewSubscriptionPage}/>
                <Route path="*" component={NotFound}/>
              </Switch>
            </GrommetApp>

            <GrommetApp>
              <Footer justify="between">
                <Title/>
                <Box direction='row'
                     align='center'
                     pad={{'between': 'medium'}}>
                  <Paragraph>
                    Say <a href="mailto:hello@if-eth.com">hello@if-eth.com</a>&emsp;© 2018 if-eth
                  </Paragraph>
                </Box>
              </Footer>
            </GrommetApp>
          </div>
        );
      }
    }
  )
);
