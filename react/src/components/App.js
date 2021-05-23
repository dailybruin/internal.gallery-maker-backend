import React, { useEffect, useState } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Home from './Home';
import CreateUpdateGallery from './CreateUpdateGallery';
import Signup from './Signup';
import { RearrangeImages } from './RearrangeImages';
import { API_ROOT } from '../constants/api';
import { LoginWrapper } from '../components/LoginWrapper';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    getAuthentication();
  });
  const getAuthentication = async () => {
    let response = await fetch(`${API_ROOT}/oauth/get_logged_in`);
    // console.log('response', response);
    let text = await response.text();
    text = JSON.parse(text);
    console.log('response text', text['ok']);
    console.log('response.ok', response.ok);
    console.log('text', text);
    let worked = text['ok'] == 'False' ? false : true;
    console.log('worked', worked);
    if (worked) {
      setLoggedIn(true);
      setLoading(false);
      console.log('set to true');
    } else {
      setLoggedIn(false);
      setLoading(false);
    }
  };
  return (
    <div className="App">
      <Switch>
        {/* <Route path="/create" component={CreateUpdateGallery} />
        <Route path="/update/:id" component={CreateUpdateGallery} />
        <Route path="/rearrange" component={RearrangeImages} /> */}
        <Route path="/signup" component={Signup} />
        <LoginWrapper
          path="/create"
          component={CreateUpdateGallery}
          isLoggedIn={loggedIn}
          isLoading={isLoading}
        />
        <LoginWrapper
          path="/update/:id"
          component={CreateUpdateGallery}
          isLoggedIn={loggedIn}
          isLoading={isLoading}
        />
        <LoginWrapper
          path="/rearrange"
          component={RearrangeImages}
          isLoggedIn={loggedIn}
          isLoading={isLoading}
        />
        <LoginWrapper
          path="/"
          component={Home}
          isLoggedIn={loggedIn}
          isLoading={isLoading}
        />
        {/* <Route
          path="/"
          render={() => <Home isLoggedIn={loggedIn} isLoading={isLoading} />}
        /> */}
      </Switch>
    </div>
  );
}

export default App;
