import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { submitGalleryCreate, submitGalleryEdit } from '../../utils';

const openNotification = () => {
  notification.error({
    message: 'Error!',
    description:
      'There was an error submitting. Double check to make sure there are no mistakes.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

const SubmitButton = (props) => {
  const state = useSelector((state) => state.editGallery); // for retrieving state
  console.log(state);
  const dispatch = useDispatch(); // for changing state
  const history = useHistory();

  const submitGallery = () => {
    const successCallback = () => {
      dispatch({
        type: 'RESET_GALLERY',
      });
      history.push('/');
    };
    const failureCallback = () => {
      openNotification();
    };
    if (props.id) {
      submitGalleryEdit(
        props.id,
        state.name,
        state.layout,
        state.description,
        state.gallery,
        successCallback,
        failureCallback
      );
    } else {
      submitGalleryCreate(
        state.name,
        state.layout,
        state.description,
        state.gallery,
        successCallback,
        failureCallback
      );
    }
    //do other stuff after
    // console.log('success', success);
    // success.then((value) => {
    //   console.log(value);
    //   if (value) {
    //   } else openNotification();
    // });
  };
  return <Button onClick={() => submitGallery()}>Submit</Button>;
};

export default SubmitButton;
