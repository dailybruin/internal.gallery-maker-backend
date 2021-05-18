import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Button } from 'antd';

import classes from './index.module.css';
import GalleryList from './gallery-list';
import SubmitButton from '../SubmitButton';
import GalleryBasicInfo from '../GalleryBasicInfo';
import { useDispatch } from 'react-redux';

function Home(props) {
  const dispatch = useDispatch();
  const resetGallery = () => {
    dispatch({
      type: 'DELETE_GALLERY',
    });
  };
  return (
    <div>
      <h1>Galleries</h1>
      <div className={classes.Container}>
        <GalleryList />
      </div>
      <Button type="primary">
        <Link to="/create" onClick={resetGallery}>
          New Gallery
        </Link>
      </Button>
    </div>
  );
}

export default Home;
