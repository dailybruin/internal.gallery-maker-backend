import React from 'react';
import { Form, Input, Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader } from 'antd';

import { MAX_NAME_LEN, MAX_DESCR_LEN } from "constants/formInput"
import { galleryOptions, readableNames } from 'constants/galleryLayouts';

const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};


function GalleryBasicInfo() {
  
  const dispatch = useDispatch(); // for changing state
  const data = useSelector((state) => state.editGallery);
 
  console.log(data)

  const fieldsFromRedux = (data) => {
  	const fields_in_form = ["name", "description", "layout"]

  	return fields_in_form.map(f => ({
  		name: [f],
  		value: data[f]
  	}))
  	
  }

  const setReduxFromFields = (allFields) => {
  	for(const field of allFields){
		if(field.name[0] === "name")
		 dispatch({
		  	type: "EDIT_NAME",
		  	payload: field.value
		  })
		else if (field.name[0] === "description")
		  dispatch({
		  	type: "EDIT_DESCRIPTION",
		  	payload: field.value
		  })
		else if (field.name[0] === "layout")
		  dispatch({
		  	type: "EDIT_LAYOUT",
		  	payload: field.value
		  })
	}
  }

  // We need to reformat the data from redux
  // format: an array of field objects
  // field object = {
  //   name: array of names,
  //   value: curr_value  
  // }
  const curr_fields = fieldsFromRedux(data)

  return (
  	<div>
  		<PageHeader
		    title="Basic Info"
		  />,
	    <Form 
	    	{...layout} 
	    	name="control-hooks" 
	    	fields={curr_fields}
		    onFieldsChange={(_, allFields) => {
		    	setReduxFromFields(allFields)
		    }}
			initialValues={{layout: "alt"}}
	    	>
	      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
	        <Input maxLength={MAX_NAME_LEN} />
	      </Form.Item>
	      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
	        <TextArea maxLength={MAX_DESCR_LEN} showCount />
	      </Form.Item>
	      <Form.Item name="layout" label="Layout Style" rules={[{ required: true }]}>
	        <Select>
				{
					Object.keys(galleryOptions).map(type =>
						<Option value={type} key={type}>{readableNames[type]}</Option>
					)
				}
	        </Select>
	      </Form.Item>
	      
	    </Form>
    {/*<pre className="language-bash">{JSON.stringify(curr_fields, null, 2)}</pre>*/}
    </div>
  );
  
};


export default GalleryBasicInfo