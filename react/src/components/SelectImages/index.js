import React, { useState, useEffect, useReducer } from 'react'
import axios from 'axios'
import './SelectImages.css'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, notification, Spin } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';

const DEFAULT_PER_PAGE = 50;

// helper component
function SelectedImage(props) {
    return (
        <div className="selected-img-container">
            <img src={props.sourceURL}
                alt=""
            />
            <span 
                className="button-overlay"
                onClick={() => {props.onRemoveClick(props.sourceURL)}}
            >
                <CloseCircleTwoTone twoToneColor="tomato" /> 
            </span>
        </div>
    );
}

//returns array of selected image urls from redux state
const selectSelectedImages = (state) => {
    return state.map((el) => el.url);
}

/*
state for displayed image data is handled by reducer.
necessary because the effect which makes a GET request to the WP endpoint
previously used the gallery state to determine if any of the fetched
images had already been selected by the user. However, this meant that the 
effect was dependent on that state, so it ran every time a user 
selected an image. This means the GET request was made every time the user selected
an image, which we don't want. To ensure the effect isn't dependent on the gallery 
state, I had to move the state update logic for displayed image data to a reducer.
*/
const initialState = { imageData: [] }

const make_reducer = (reduxGallery) => 
    (state, action) => {
        let newImageData;

        switch (action.type) {
            case 'updatePage':
                let selectedImages = reduxGallery.map(img => img.url);
                newImageData = action.payload.map(img => 
                    ({
                        sourceURL: img.source_url,
                        selected: selectedImages.includes(img.source_url)
                    })
                );
                return { ...state, imageData: newImageData }
            
            case 'toggleSelectedField':
                newImageData = state.imageData.map(
                    img => img.sourceURL === action.payload ? {...img, selected: !img.selected} : img
                );
                return { ...state, imageData: newImageData }

            default:
                return state;
    }
}

function SelectImages(props) {
    const reduxGallery = useSelector(state => state.editGallery.gallery);
    const reduxDispatch = useDispatch();
    const [state, dispatch] = useReducer(make_reducer(reduxGallery), initialState);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(DEFAULT_PER_PAGE);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timestamp = Date.now();
        axios.get(`https://wp.dailybruin.com/wp-json/wp/v2/media?page=${page}&per_page=${pageSize}&orderby=date&to_prevent_caching=${timestamp}`)
            .then(res => {
                dispatch({ type: 'updatePage', payload: res.data });
                setTotalItems(res.headers["x-wp-total"]);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                notification.error({
                    message: "Failed to retrieve images from WordPress.",
                    description: `${err.message}`,
                    duration: 0,
                });
            });
    }, [page, pageSize]);

    const removeSelectedImage = (clickedImgURL) => {
        dispatch({ type: 'toggleSelectedField', payload: clickedImgURL });
        reduxDispatch({
            type: "REMOVE_GALLERY_IMAGE",
            payload: clickedImgURL
        });
    }

    const handleImageClick = (clickedImg) => {
        if (clickedImg.selected) {
            removeSelectedImage(clickedImg.sourceURL);
        } 
        else {
            dispatch({ type: 'toggleSelectedField', payload: clickedImg.sourceURL });
            reduxDispatch({
                type: "EDIT_GALLERY",
                payload: [...reduxGallery, {
                    url: clickedImg.sourceURL,
                    caption: "",
                    credits: "",
                }]
            });
        }
    }

    const handlePageSizeChange = (current, size) => {
        /*adjust page number so the first image on the page previously viewed is still on the new page*/
        let oldPerPage = pageSize;
        let oldPage = current;
        let newPageSize = size;
        let curImageNum = (((oldPage - 1) * oldPerPage) + 1) / newPageSize
        let newPage = Math.ceil(curImageNum/newPageSize);
        setPageSize(newPageSize);
        setPage(newPage);
    }

    const handlePageChange = (newPage, newPageSize) => {
        setPage(newPage);
        setPageSize(newPageSize);
    }

    return (
        <div>
            <div className="columns">
                <div className="img-grid">
                    <h3>
                        Select images to put in the gallery (don't worry about order now; you can reorder them later!)
                    </h3>
                    {loading ?
                        <div className='loading-vertical-align'>
                            <Spin size='large' style={{height: '50%'}}/>
                        </div> 
                        :
                         state.imageData.map(img => 
                            <img src={img.sourceURL} 
                                alt=""
                                className={img.selected ? "img-selected" : ""}
                                onClick={() => handleImageClick(img)}
                                key={img.sourceURL}
                            />
                        )
                    }
                </div>
                <div className="selected-imgs">
                    {
                        selectSelectedImages(reduxGallery).length > 0 ?
                            <div>
                                <p>{`Selected images: ${selectSelectedImages(reduxGallery).length}`}</p>
                                {
                                    selectSelectedImages(reduxGallery).map(imgURL => 
                                        <SelectedImage
                                            sourceURL={imgURL}
                                            onRemoveClick={removeSelectedImage}
                                            key={imgURL}
                                        />
                                    )
                                }   
                            </div>
                        :
                            <p>Selected images will appear here</p>
                    }
                </div>
            </div>
            <div className="pagination-container">
                <Pagination
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageSizeChange}
                    total={totalItems}
                    current={page}
                    pageSize={pageSize}
                    showQuickJumper
                    showSizeChanger
                    showTotal={(total, range) => {
                        return `Showing images ${range[0]}-${range[1]} of ${total}`;
                    }}
                />
            </div>
        </div>
    );
}

export default SelectImages