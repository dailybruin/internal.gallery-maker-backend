import React, { useState } from 'react';
import { Form, Input, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import "./caption.css"
import { MAX_CAPTION_LEN, MAX_CREDIT_LEN } from "constants/formInput"
import { galleryOptions, readableNames } from 'constants/galleryLayouts';

const { TextArea } = Input;

// helper component
function CaptionImagePair(props){


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


   const [caption, setCaption] = useState(props.initialCaption)
   const [credit, setCredit] = useState(props.initialCredit)
   const [type, setType] = useState(props.initialType)

   const dispatch = useDispatch()

   function updateStateAndReduxCaption(value){
        setCaption(value)
        dispatch({
            type: "EDIT_CAPTION",
            payload: {
                url: props.img_url,
                newCaption: value
            }
        })
   }

   function updateStateAndReduxCredit(value){
    setCredit(value)
    dispatch({
        type: "EDIT_CREDIT",
        payload: {
            url: props.img_url,
            newCredit: value
        }
    })
   }

   function updateStateAndReduxType(value) {
       setType(value);
       dispatch({
           type: "EDIT_TYPE",
           payload: {
               url: props.img_url,
               newType: value
           }
       });
   }

   return (
    <div className="image-caption-row">
        <img className="caption-image" src={props.img_url}/>
        <div>
            <Form.Item label="Caption">
                <TextArea
                    maxLength={MAX_CAPTION_LEN}
                    showCount
                    value={caption}
                    onChange={e => updateStateAndReduxCaption(e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Credit">
                <TextArea
                    maxLength={MAX_CREDIT_LEN}
                    showCount
                    value={credit}
                    onChange={e => updateStateAndReduxCredit(e.target.value)}
                />
            </Form.Item>
            <Form.Item label="Type">
                <Select
                    value={type}
                    onChange={updateStateAndReduxType}>
                    {
                        props.imageTypes.map(type => 
                            <Select.Option value={type} key={type}>{readableNames[type]}</Select.Option>
                        )
                    }
                </Select>
            </Form.Item>
        </div>
    </div>
  );
}

const selectorForGallery = state => state.editGallery.gallery;
const equalityCheck = (newState, state) => {
  // console.log("old state")
  // console.log(state);
  console.log('new state');
  console.log(newState);

  if (state.length != newState.length) return false;
  for (let i = 0; i < state.length; i++) {
    if (state[i].url != newState[i].url) return false;
  }
  return true;
};

function TextBox(props) {
  // props: {text: string, key: number, initialText: string, index: number}
  const [text, setText] = useState(props.initialText);

  const dispatch = useDispatch();

  function updateStateAndReduxText(value) {
    setText(value);
    console.log('index to edit:', props.index);
    dispatch({
      type: 'EDIT_TEXTBOX',
      payload: {
        index: props.index,
        newText: value,
      },
    });
  }

  function deleteTextbox() {
    dispatch({
      type: 'DELETE_TEXTBOX',
      payload: {
        index: props.index,
      },
    });
  }
  return (
    <div className="textbox-container">
      <div>
        <Form.Item label="Textbox">
          <TextArea
            maxLength={MAX_CAPTION_LEN}
            showCount
            value={text}
            onChange={(e) => updateStateAndReduxText(e.target.value)}
          />
        </Form.Item>
      </div>
      <div className="delete-textbox-button">
        <Button onClick={deleteTextbox}>Delete Textbox</Button>
      </div>
    </div>
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
    const gallery =  useSelector(selectorForGallery, equalityCheck);
    const galleryLayout = useSelector(state => state.editGallery.layout);

    return (<div className="caption-container">
        <h2> Captions and Credits </h2>
        {gallery.map(img => <CaptionImagePair 
            key={img.url} 
            img_url={img.url} 
            initialCaption={img.caption}
            initialCredit={img.credits}
            initialType={img.type}
            imageTypes={galleryOptions[galleryLayout]}
            />)}
    </div>)


function CaptionsForm() {
  // if we don't use a custom equality check
  // then too many re renders will be triggered

  // When the CaptionImagePair changes redux state, the array
  // is replace with a copy. By default, the equality check
  // checks references so it will certainly think the array has changed
  // however, as long as the image urls don't change, we don't need to re run this
  // so in order to prevent this, we use a custom equality check which actually
  // compares the img urls in the old state and the new redux state.
  const gallery = useSelector(selectorForGallery, equalityCheck);
  return (
    <div classname="caption-container">
      <h2> captions and credits </h2>
      {gallery.map((item, index) => {
        if ('url' in item) {
          return (
            <div className="item-container">
              <CaptionImagePair
                key={item.url}
                img_url={item.url}
                initialCaption={item.caption}
                initialCredit={item.credits}
              />
              <AddTextBoxButton index={index + 1} />
            </div>
          );
        } else if ('text' in item) {
          return (
            <div className="item-container">
              <TextBox content={item.text} key={index} index={index} />
              <AddTextBoxButton index={index + 1} />
            </div>
          );
        }
        return;
      })}
    </div>
  );
}

export default CaptionsForm;
