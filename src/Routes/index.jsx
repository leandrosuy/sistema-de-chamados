import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../Pages/SignIn';
import SignUp from '../Pages/SingUp';
import Dashboard from '../Pages/Dashboard';
import Profile from '../Pages/Profile';
import Custumers from '../Pages/Custumers';
import New from '../Pages/New';

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/register" component={SignUp} />
            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/profile" component={Profile} isPrivate />
            <Route exact path="/custumers" component={Custumers} isPrivate />
            <Route exact path="/new" component={New} isPrivate />
            <Route exact path="/new/:id" component={New} isPrivate />
        </Switch>
    );
}