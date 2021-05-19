import React, { useState } from 'react';

import { Select, Button, Form, Input } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import './caption.css';
import { MAX_CAPTION_LEN, MAX_CREDIT_LEN } from 'constants/formInput';
import { v4 as uuidv4 } from 'uuid';
import { galleryOptions, readableNames } from 'constants/galleryLayouts';
const { TextArea } = Input;

// helper component
function CaptionImagePair(props) {
  // its a little awkward that there is local state and there redux state
  // the reason I didn't want to just have each caption image pair read the redux state
  // is because it would require each CaptionImagePair to look through the gallery array
  // and check if their caption changed every time a single character is typed in
  // this will cost O(n^2) where n is the number of images.
  // In this approach, the parent component provides the initial credits and captions
  // so no array checks in this component

  // if later on, we decide to use only redux state, here is a selector we can use
  // function selectCaption(state) {
  //   const gallery =  state.editGallery.gallery;
  //   matching_images = gallery.filter(img => img.url === img_url)
  //   if(matching_images.length == 0)
  //       return null
  //   else
  //       return matching_images[0].caption;
  // }
  // const caption = useSelector(selectCaption); // for retrieving caption for this image

  const [caption, setCaption] = useState(props.initialCaption);
  const [credit, setCredit] = useState(props.initialCredit);
  const [type, setType] = useState(props.initialType);

  const dispatch = useDispatch();

  function updateStateAndReduxCaption(value) {
    setCaption(value);
    dispatch({
      type: 'EDIT_CAPTION',
      payload: {
        url: props.img_url,
        newCaption: value,
      },
    });
  }

  function updateStateAndReduxCredit(value) {
    setCredit(value);
    dispatch({
      type: 'EDIT_CREDIT',
      payload: {
        url: props.img_url,
        newCredit: value,
      },
    });
  }

  function updateStateAndReduxType(value) {
    setType(value);
    dispatch({
      type: 'EDIT_TYPE',
      payload: {
        url: props.img_url,
        newType: value,
      },
    });
  }

  return (
    <div className="image-caption-container">
      <div className="image-caption-row">
        <img className="caption-image" src={props.img_url} />
        <div>
          <Form.Item label="Caption">
            <TextArea
              maxLength={MAX_CAPTION_LEN}
              showCount
              value={caption}
              onChange={(e) => updateStateAndReduxCaption(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Credit">
            <TextArea
              maxLength={MAX_CREDIT_LEN}
              showCount
              value={credit}
              onChange={(e) => updateStateAndReduxCredit(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Type">
            <Select value={type} onChange={updateStateAndReduxType}>
              {props.imageTypes.map((type) => (
                <Select.Option value={type} key={type}>
                  {readableNames[type]}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>
      <AddTextBoxButton id={props.img_url} />
    </div>
  );
}

const selectorForGallery = (state) => state.editGallery.gallery;
const equalityCheck = (newState, state) => {
  console.log('old state', state);
  console.log('new state', newState);
  //console.log('new try', gallery);

  if (state.length !== newState.length) return false;
  for (let i = 0; i < state.length; i++) {
    if (state[i].metatype === newState[i].metatype) {
      if (state[i].metatype === 'image') {
        if (state[i].url !== newState[i].url) return false;
      }
    } else return false;
  }
  return true;
};

function TextBox(props) {
  // props: {key: string, content: string, id: string, index: number}
  const [text, setText] = useState(props.content);

  const dispatch = useDispatch();

  function updateStateAndReduxText(value) {
    setText(value);
    console.log('editing id:', props.id);
    dispatch({
      type: 'EDIT_TEXTBOX',
      payload: {
        id: props.id,
        newText: value,
      },
    });
  }

  function deleteTextbox() {
    console.log('deleting id:', props.id);
    dispatch({
      type: 'DELETE_TEXTBOX',
      payload: {
        id: props.id,
      },
    });
  }
  return (
    <div className="textbox-container">
      <div>
        <Form.Item label="Textbox">
          <TextArea
            showCount
            value={text}
            onChange={(e) => updateStateAndReduxText(e.target.value)}
          />
        </Form.Item>
      </div>
      <div className="delete-textbox-button">
        <Button onClick={deleteTextbox}>Delete Textbox</Button>
      </div>
      <AddTextBoxButton id={props.id} />
    </div>
  );
}

function AddTextBoxButton(props) {
  //props: {index: number}
  // newprops: {id: string}
  const dispatch = useDispatch();
  let newID = uuidv4();
  const insertTextBox = () => {
    dispatch({
      type: 'CREATE_TEXTBOX',
      payload: {
        // index: props.index,
        location: props.id,
        id: newID,
      },
    });
  };
  return (
    <Button className="add-text-button" onClick={insertTextBox}>
      Add Text Box
    </Button>
  );
}

function CaptionsForm() {
  // if we don't use a custom equality check
  // then too many re renders will be triggered

  // When the CaptionImagePair changes redux state, the array
  // is replace with a copy. By default, the equality check
  // checks references so it will certainly think the array has changed
  // however, as long as the image urls don't change, we don't need to re run this
  // so in order to prevent this, we use a custom equality check which actually
  // compares the img urls in the old state and the new redux state.
  // const gallery = useSelector(selectorForGallery);
  const gallery = useSelector(selectorForGallery, equalityCheck);
  const galleryLayout = useSelector((state) => state.editGallery.layout);
  return (
    <div classname="caption-container">
      <h2> captions and credits </h2>
      <AddTextBoxButton id="first" />
      {gallery.map((item, index) => {
        if (item.metatype == 'image') {
          return (
            <div className="item-container">
              <CaptionImagePair
                key={item.url}
                img_url={item.url}
                initialCaption={item.caption}
                initialCredit={item.credits}
                index={index}
                initialType={item.type}
                imageTypes={galleryOptions[galleryLayout]}
              />
            </div>
          );
        } else if (item.metatype == 'text') {
          return (
            <div className="item-container">
              <TextBox
                content={item.content}
                key={item.id}
                id={item.id}
                index={index}
              />
            </div>
          );
        }
        return;
      })}
    </div>
  );
}

export default CaptionsForm;
