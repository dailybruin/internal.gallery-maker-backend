import React, { useState, useEffect, useRef } from 'react';
import SelectImages from '../SelectImages';
import { RearrangeImages } from '../RearrangeImages';
import CaptionsForm from '../CaptionForm';

import GalleryBasicInfo from '../GalleryBasicInfo';
import SubmitButton from '../SubmitButton';

import { Steps, Button, notification } from 'antd';
import { useDispatch, useStore } from 'react-redux';
import './CreateUpdateGallery.css';
import { API_ROOT } from '../../constants/api';
import axios from 'axios';
import { Prompt } from 'react-router';

const TOTAL_STEPS = 4;
const { Step } = Steps;

function CreateUpdateGallery(props) {
  const [curStep, setCurStep] = useState(0);
  const [dirty, setDirty] = useState(false);
  const reduxDispatch = useDispatch();
  const reduxStore = useStore();
  const unsubscribe = useRef(null);

  useEffect(() => {
    const reduxSubscribe = () => {
      unsubscribe.current = reduxStore.subscribe(() => {
        setDirty(true);
        unsubscribe.current();
      });
    };

    const reduxUnsubscribe = () => () => unsubscribe.current();

    if (props.match.path === '/update/:id') {
      axios
        .get(`${API_ROOT}/gallery/${props.match.params.id}`)
        .then((res) => {
          let reduxGallery = res.data.images.map((img) => ({
            url: img.img_url,
            caption: img.description,
            credits: img.credits,
            type: img.type,
          }));
          reduxDispatch({
            type: 'EDIT_GALLERY',
            payload: [...reduxGallery],
          });
          reduxDispatch({
            type: 'EDIT_NAME',
            payload: res.data.name,
          });
          reduxDispatch({
            type: 'EDIT_DESCRIPTION',
            payload: res.data.description,
          });
          reduxDispatch({
            type: 'EDIT_LAYOUT',
            payload: res.data.layout,
          });
        })
        .then(() => reduxSubscribe())
        .catch((err) => {
          notification.error({
            message: 'Failed to retrieve galleries from server.',
            description: `${err.message}`,
            duration: 0,
          });
        });
      return reduxUnsubscribe();
    } else {
      reduxSubscribe();
      return reduxUnsubscribe();
    }
  }, [props.match.path, props.match.params.id, reduxDispatch, reduxStore]);

  function renderStep(step) {
    switch (step) {
      case 0:
        return <GalleryBasicInfo />;
      case 1:
        return <SelectImages />;
      case 2:
        return <RearrangeImages />;
      case 3:
        return <CaptionsForm />;
      default:
        return null;
    }
  }

  const next = () => {
    setCurStep(curStep + 1);
  };

    const handleSubmit = () => {
        setDirty(false);
    }

    const submitbutton = props.match.path === '/update/:id' ? 
        <SubmitButton id={props.match.params.id}
            onSubmit={handleSubmit}/> :
        <SubmitButton 
            onSubmit={handleSubmit}/>

  const submitbutton =
    props.match.path === '/update/:id' ? (
      <SubmitButton id={props.match.params.id} />
    ) : (
      <SubmitButton />
    );

  return (
    <div>
      <Prompt
        when={dirty}
        message="You have unsaved changes. Are you sure you want to leave this page?"
      />
      {renderStep(curStep)}
      <div className="steps-nav-container">
        <Steps current={curStep} className="steps">
          <Step title="Basic info" />
          <Step title="Select images" />
          <Step title="Rearrange images" />
          <Step title="Add captions" />
        </Steps>
        <div>
          {curStep > 0 ? (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          ) : (
            <Button style={{ margin: '0 8px' }} disabled>
              Previous
            </Button>
          )}
          {curStep < TOTAL_STEPS - 1 ? (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          ) : (
            submitbutton
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateUpdateGallery;
